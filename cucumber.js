/**
 * Cucumber.js configuration
 *
 * All .feature files live permanently in features/cucumber/ (git-tracked).
 * Which of them actually run is controlled by the hand-edited, git-tracked
 * features/cucumber/enabled-features.json — a { "filename.feature": "yes" |
 * "no" } map. Flip a value to "no" to stop running that file; "yes" to run
 * it. Any .feature file found in the folder that ISN'T yet in the map is
 * auto-added here (defaulting to "no", so a newly-dropped-in/WIP feature
 * doesn't silently join the full run) and the file is rewritten — just flip
 * it to "yes" next time you want it included. Use `--tags` on top of this to
 * run a subset of scenarios within the enabled files. Test data and
 * environment URLs are local too (features/cucumber/test-data/localTestData.js,
 * loaded by world.js) — no Confluence fetch happens at test-run time.
 */
import fs from 'fs';

const FEATURES_DIR = 'features/cucumber';
const ENABLED_FILE = `${FEATURES_DIR}/enabled-features.json`;
const TRUTHY = new Set(['yes', 'true', '1', 'y']);

function getSelectedPaths() {
  const allFeatureFiles = fs.readdirSync(FEATURES_DIR).filter(f => f.endsWith('.feature'));

  let enabled = {};
  try {
    enabled = JSON.parse(fs.readFileSync(ENABLED_FILE, 'utf-8'));
  } catch {
    enabled = {};
  }

  let changed = false;
  for (const f of allFeatureFiles) {
    if (!(f in enabled)) {
      enabled[f] = 'no';
      changed = true;
      console.log(`📋 New feature file detected — added "${f}" to enabled-features.json (default: no)`);
    }
  }
  // Drop entries for files that no longer exist, so the map doesn't rot.
  for (const key of Object.keys(enabled)) {
    if (!allFeatureFiles.includes(key)) {
      delete enabled[key];
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(ENABLED_FILE, JSON.stringify(enabled, null, 2) + '\n');
  }

  const selected = Object.entries(enabled)
    .filter(([, v]) => TRUTHY.has(String(v).trim().toLowerCase()))
    .map(([f]) => `${FEATURES_DIR}/${f}`);

  if (selected.length === 0) {
    console.log('⚠️  No feature files marked "yes" in enabled-features.json — nothing will run.');
    return [`${FEATURES_DIR}/__none_enabled__.feature`]; // deliberately matches nothing
  }
  console.log(`📋 Running ${selected.length} feature file(s) marked "yes" in enabled-features.json`);
  return selected;
}

// Cucumber-JS v10+ expects configuration at the top level of the exported
// object (not wrapped in a `default:` profile) — wrapping it in `default:`
// silently drops `paths`, falling back to Cucumber's own default glob.
export default {
  paths: getSelectedPaths(),
  import: [
    'features/cucumber/support/world.js',
    'features/cucumber/step_definitions/**/*.js',
  ],
  format: [
    'progress-bar',
    'json:test-results/cucumber-report.json',
  ],
  publishQuiet: true,
  timeout: 120000,
  // Each scenario launches its own isolated browser/context/page (world.js
  // Before hook) with no shared state, so scenarios are safe to run concurrently
  // in principle. In practice, BOTH parallel:3 and parallel:2 caused the same
  // resource-contention failure on this machine — the Find a Dealer page's
  // async search/map widget (.hyu-fad-section) intermittently doesn't finish
  // loading under 2+ concurrent headless Chromium instances, even with
  // generous timeouts (confirmed reproducible: identical "Dealer type toggle
  // never became visible" error on all 3 FindADealer-FIFO scenarios at both
  // parallel levels). Scenario-level parallelism isn't safe here at any level
  // above 1 — speed work instead targets internal parallelism within the
  // heaviest individual steps (see calculator_pricing.steps.js /
  // CPC-pageLoad.steps.js). Keep this at 1 unless run on hardware with more
  // headroom.
  parallel: 1,
};
