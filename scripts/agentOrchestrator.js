/**
 * AI Test Agent Orchestrator
 *
 * Single-command pipeline that:
 *   1. Auto-generates step definitions for any undefined steps
 *   2. Runs Cucumber tests via Playwright
 *   3. Generates a PDF report of the results and uploads it to Confluence
 *
 * Feature files and test data are NOT fetched from Confluence — they live
 * permanently, git-tracked, in features/cucumber/ (see
 * features/cucumber/test-data/localTestData.js). Every run executes every
 * feature file (use `--tags` to run a subset). Which environment (Dev / Dev1
 * / Stage / Production) tests run against is controlled by TARGET_ENVIRONMENT
 * in .env — see .env.example.
 *
 * Usage:
 *   node scripts/agentOrchestrator.js                     # full pipeline (existing step files PRESERVED)
 *   node scripts/agentOrchestrator.js --skip-generate       # skip step def generation entirely
 *   node scripts/agentOrchestrator.js --update-steps        # re-generate / append-missing into existing step files
 *   node scripts/agentOrchestrator.js --report-only         # regenerate report from last run
 *   node scripts/agentOrchestrator.js --claude-fix          # full pipeline + Claude auto-fix loop on failure
 *
 * Step-file lifecycle:
 *   • If NO `<feature>_auto.steps.js` exists → DOM inspection (+ MCP) runs and a fresh file is generated.
 *   • If a step file ALREADY exists → it is left untouched on every subsequent run.
 *     Auto-fixes only happen on test failure via the Claude/MCP fix loop, never on a clean run.
 *     Pass `--update-steps` to opt into appending newly-detected steps to existing files.
 */
import { execSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

// ─── Paths ───────────────────────────────────────────────────
const ROOT = path.resolve('.');
const FEATURES_DIR = path.join(ROOT, 'features', 'cucumber');
const RESULTS_JSON = path.join(ROOT, 'test-results', 'cucumber-report.json');

// ─── Helpers ─────────────────────────────────────────────────
function banner(msg) {
  const line = '═'.repeat(msg.length + 4);
  console.log(`\n╔${line}╗`);
  console.log(`║  ${msg}  ║`);
  console.log(`╚${line}╝\n`);
}

function run(cmd, label) {
  console.log(`▶ ${label}`);
  console.log(`  $ ${cmd}\n`);
  try {
    execSync(cmd, { stdio: 'inherit', cwd: ROOT });
    return true;
  } catch (err) {
    console.error(`✖ ${label} failed (exit ${err.status})`);
    return false;
  }
}

function elapsed(start) {
  const sec = ((Date.now() - start) / 1000).toFixed(1);
  return `${sec}s`;
}

// ─── Pipeline Steps ──────────────────────────────────────────

async function stepGenerateStepDefs() {
  banner('Step 2 — Auto-Generate Missing Step Definitions');
  const { generateStepDefinitions } = await import('./generateStepDefs.js');
  const result = await generateStepDefinitions();
  if (result.generated > 0) {
    console.log(`✅ Auto-generated ${result.generated} step definition(s) in ${result.files.length} file(s)`);
    for (const f of result.files) console.log(`   📄 ${f}`);
  } else {
    console.log('✅ All steps already have definitions — nothing to generate');
  }
  return result;
}

function stepRunTests(tags) {
  banner('Step 3 — Run Cucumber Tests');

  // Ensure results dir exists
  const resultsDir = path.dirname(RESULTS_JSON);
  if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });

  const tagArg = tags ? ` --tags "${tags}"` : '';
  // Use a relative path so there is no Windows drive-letter colon (C:\) to confuse the parser.
  // The deprecation warning is harmless — the file is still written correctly.
  const formatArg = '--format json:test-results/cucumber-report.json';
  const cmd = `npx cucumber-js --config cucumber.js ${formatArg}${tagArg}`;
  const testRunStart = Date.now();
  const ok = run(cmd, `Cucumber${tags ? ` (${tags})` : ''}`);
  const testRunDurationMs = Date.now() - testRunStart;

  // Persist the actual wall-clock time Cucumber took (distinct from the
  // pipeline's overall time, which also includes the Confluence fetch/upload
  // steps) so the PDF report can show how long the tests themselves took.
  try {
    const cacheDir = path.join(ROOT, '.cache');
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
    fs.writeFileSync(
      path.join(cacheDir, 'lastTestRunDuration.json'),
      JSON.stringify({ durationMs: testRunDurationMs, finishedAt: new Date().toISOString() }),
    );
  } catch { /* non-critical — report just omits the duration */ }

  if (fs.existsSync(RESULTS_JSON)) {
    const raw_content = fs.readFileSync(RESULTS_JSON, 'utf-8').trim();
    if (raw_content) {
      try {
        const raw = JSON.parse(raw_content);
        const scenarios = raw.flatMap(f => (f.elements || []).filter(e => e.type !== 'background'));
        const BAD = new Set(['failed', 'ambiguous', 'undefined', 'pending']);
        const pass = scenarios.filter(s =>
          (s.steps || []).filter(st => !['Before','After'].includes((st.keyword||'').trim()))
                         .every(st => !BAD.has(st.result?.status))
        ).length;
        const fail = scenarios.length - pass;
        console.log(`📊 Scenarios: ${scenarios.length} total | ${pass} passed | ${fail} failed`);
      } catch { /* ignore parse errors here — report step will surface them */ }
    }
  }

  return ok;
}

async function stepGenerateAndUploadReports(runStartMs, reportOnly = false) {
  banner('Step 4 & 5 — Generate Per-Feature Reports and Upload to Confluence');
  const { generatePDFForFeature, generatePDF } = await import('./generateReport.js');
  const { uploadReportToConfluence } = await import('./uploadReportToConfluence.js');

  // The environment tests actually ran against is whatever TARGET_ENVIRONMENT
  // in .env was for this whole process (world.js reads the same value) — no
  // Confluence round-trip needed to know which "<env> Report" column to target.
  const activeEnvironment = (process.env.TARGET_ENVIRONMENT || 'Stage').trim();
  console.log(`   → Target Confluence column: "${activeEnvironment} Report"`);

  // Report on whichever feature files cucumber.js actually ran this pass —
  // the { filename: "yes"|"no" } map in features/cucumber/enabled-features.json
  // (same resolution cucumber.js itself uses), falling back to every .feature
  // file in FEATURES_DIR if that map is missing/unreadable.
  let testedFeatureFiles;
  try {
    const enabled = JSON.parse(fs.readFileSync(path.join(FEATURES_DIR, 'enabled-features.json'), 'utf-8'));
    const TRUTHY = new Set(['yes', 'true', '1', 'y']);
    const names = Object.entries(enabled)
      .filter(([, v]) => TRUTHY.has(String(v).trim().toLowerCase()))
      .map(([f]) => f);
    testedFeatureFiles = names.length > 0 ? names : null;
  } catch {
    testedFeatureFiles = null;
  }
  if (!testedFeatureFiles) {
    testedFeatureFiles = fs.readdirSync(FEATURES_DIR).filter(f => f.endsWith('.feature'));
  }

  // Fallback: generate one combined report when no feature files are found
  if (testedFeatureFiles.length === 0) {
    console.log('⚠️  No feature files found — generating combined report');
    const origArgv = process.argv;
    process.argv = [process.argv[0], process.argv[1], RESULTS_JSON];
    const result = await generatePDF();
    process.argv = origArgv;
    return [result];
  }

  const reports = [];
  for (const featureFile of testedFeatureFiles) {
    console.log(`\n📄 Generating report for: ${featureFile}`);
    const result = await generatePDFForFeature(RESULTS_JSON, featureFile);
    if (!result) continue;

    // ── Special case: some scenarios write their OWN rich per-feature PDF to
    // excel-reports/<Prefix>_<env>_<timestamp>.pdf (e.g. CalculatorPricing_*,
    // CpcPageLoad_*). Prefer that artefact over the generic Cucumber TestReport.
    let uploadPath = result.pdfPath;
    const customReport = [
      { match: /calculator[_-]?pricing/i, prefix: 'CalculatorPricing', label: 'calculator pricing' },
      { match: /cpc[_-]?pageload/i,       prefix: 'CpcPageLoad',       label: 'CPC page-load' },
    ].find(c => c.match.test(featureFile));
    if (customReport) {
      try {
        const dir = path.join(ROOT, 'excel-reports');
        const envName = (process.env.TARGET_ENVIRONMENT || '').trim().replace(/[^a-zA-Z0-9]/g, '');
        const prefix = customReport.prefix;
        const envRe = envName
          ? new RegExp(`^${prefix}_${envName}_.*\\.pdf$`, 'i')
          : new RegExp(`^${prefix}(?:_[A-Za-z0-9]+)?_.*\\.pdf$`, 'i');
        // Only consider custom PDFs that were (re)generated by THIS run, so a
        // stale report from a previous run is never uploaded. A report-only
        // run reuses the last run's artefacts, so the freshness gate is skipped.
        const isFromThisRun = (fileName) => {
          if (reportOnly || !runStartMs) return true;
          try {
            return fs.statSync(path.join(dir, fileName)).mtimeMs >= runStartMs;
          } catch {
            return false;
          }
        };
        let candidates = fs.readdirSync(dir).filter(f => envRe.test(f) && isFromThisRun(f)).sort();
        // Fallback to any matching-prefix PDF from this run if env-specific not found.
        if (!candidates.length) {
          candidates = fs.readdirSync(dir)
            .filter(f => new RegExp(`^${prefix}.*\\.pdf$`, 'i').test(f) && isFromThisRun(f))
            .sort();
        }
        if (candidates.length) {
          uploadPath = path.join(dir, candidates.at(-1));
          console.log(`   → Using ${customReport.label} report: ${path.basename(uploadPath)}`);
        } else {
          console.warn(
            `   ⚠️  No fresh ${customReport.label} report from this run — ` +
            `uploading this run's generic report instead of a stale one: ${path.basename(uploadPath)}`
          );
        }
      } catch (e) {
        console.warn(`   ⚠️  Could not locate ${customReport.prefix} PDF: ${e.message}`);
      }
    }

    reports.push({ ...result, uploadedPdfPath: uploadPath });
    console.log(`\n📤 Uploading report for: ${featureFile}`);
    const status = (result.stats && typeof result.stats.fail === 'number')
      ? (result.stats.fail === 0 && result.stats.pass > 0 ? 'PASS' : 'FAIL')
      : '';
    await uploadReportToConfluence(uploadPath, [featureFile], status);
  }

  return reports;
}

// ─── Main Orchestrator ───────────────────────────────────────
async function orchestrate() {
  const args = process.argv.slice(2);
  const skipGenerate = args.includes('--skip-generate');
  const updateSteps = args.includes('--update-steps');
  const reportOnly = args.includes('--report-only');
  const claudeFix = args.includes('--claude-fix');
  const mcpFix = args.includes('--mcp-fix');
  const tags = args.find(a => a.startsWith('--tags='))?.split('=')[1] || '';

  const start = Date.now();

  banner('🤖 Test Agent — Starting Pipeline');
  console.log(`  Environment:    ${(process.env.TARGET_ENVIRONMENT || 'Stage').trim()}`);
  console.log(`  Skip generate:  ${skipGenerate}`);
  console.log(`  Update steps:   ${updateSteps}  ${updateSteps ? '' : '(existing step files will be preserved)'}`);
  console.log(`  Report only:    ${reportOnly}`);
  console.log(`  Claude fix:     ${claudeFix}`);
  console.log(`  MCP fix:        ${mcpFix}`);
  if (tags) console.log(`  Tags filter: ${tags}`);

  try {
    if (!reportOnly) {
      if (skipGenerate) {
        console.log('⏭  Skipping step generation (--skip-generate)');
      } else {
        // Pass --update-steps through to the generator via env so we don't
        // need to plumb argv through every import boundary.
        if (updateSteps) process.env.UPDATE_STEPS = '1';
        await stepGenerateStepDefs();
      }

      if (mcpFix) {
        // MCP-first fix loop — uses Playwright MCP for interactive live-page inspection
        banner('Step 3 — Run Tests + MCP Auto-Fix Loop (Playwright MCP)');
        const { spawnSync } = await import('node:child_process');
        const mcpFixArgs = ['scripts/mcpAutoFixer.js'];
        if (tags) mcpFixArgs.push('--tags', tags);
        console.log(`▶ node ${mcpFixArgs.join(' ')}\n`);
        const result = spawnSync(process.execPath, mcpFixArgs, {
          stdio: 'inherit',
          cwd: ROOT,
        });
        if (result.status !== 0) {
          console.log('\n⚠️  MCP fix loop exited with failures — generating report from last run.');
        }
      } else if (claudeFix) {
        // Standard Claude fix loop — uses pre-scraped DOM + MCP for inspection
        banner('Step 3 — Run Tests + Claude Auto-Fix Loop');
        const { spawnSync } = await import('node:child_process');
        const claudeFixArgs = ['scripts/claudeFixLoop.js'];
        if (tags) claudeFixArgs.push('--tags', tags);
        console.log(`▶ node ${claudeFixArgs.join(' ')}\n`);
        const result = spawnSync(process.execPath, claudeFixArgs, {
          stdio: 'inherit',
          cwd: ROOT,
        });
        if (result.status !== 0) {
          console.log('\n⚠️  Claude fix loop exited with failures — generating report from last run.');
        }
      } else {
        const passed = stepRunTests(tags);
        if (!passed) {
          // Do NOT auto-iterate. A failing test stops here and we go straight to
          // report generation from this run. Run the auto-fix loop only on demand
          // with `--claude-fix` (or `--mcp-fix`) when you actually want it.
          banner('Step 3.1 — Tests Failed — Stopping (no auto-fix)');
          console.log('⚠️  Tests failed. Skipping the auto-fix loop and generating the report from this run.');
          console.log('    To run the fix loop, re-run with:  npm run agent:claude-fix   (or --mcp-fix)\n');
        }
      }
    } else {
      console.log('⏭  Skipping to report generation (--report-only)');
    }

    const reports = await stepGenerateAndUploadReports(start, reportOnly);

    banner('✅ Pipeline Complete');
    for (const r of reports) {
      console.log(`  PDF report: ${r.pdfPath}  (pass rate: ${r.stats.passRate}%)`);
    }
    console.log(`  Total time: ${elapsed(start)}`);
  } catch (err) {
    console.error(`\n❌ Pipeline failed: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
  }
}

orchestrate();
