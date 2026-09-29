/**
 * Shared helper functions — no Cucumber imports.
 *
 * Import from here (not common_steps.js) to avoid loading a step-definition
 * module as a static ESM dependency, which causes Cucumber's builder to run
 * before it reaches 'running' status and throws a PENDING error.
 *
 * Usage:
 *   import { handleLocationModal } from './commonHelpers.js';
 */

/**
 * Dismiss the Hyundai "Set your location" postcode modal.
 * Two inputs share id="locaion-modal-input" (typo in site HTML).
 * The first is 0×0 hidden; we iterate backwards to find the visible one.
 */
export async function handleLocationModal(page, postcode = '2000') {
  const modalContainer = page.locator('.hyu-postcode-modal.tingle-modal--visible').first();
  try {
    await modalContainer.waitFor({ state: 'visible', timeout: 15000 });
  } catch {
    console.log('📍 No location modal appeared — continuing');
    return;
  }
  console.log('📍 Location modal detected — filling postcode via visible input');

  const modalInputs = page.locator('.hyu-postcode-modal input#locaion-modal-input');
  const inputCount = await modalInputs.count();
  let modalInput = null;
  for (let i = inputCount - 1; i >= 0; i--) {
    const el = modalInputs.nth(i);
    if (await el.isVisible().catch(() => false)) { modalInput = el; break; }
  }

  if (modalInput) {
    await modalInput.fill(postcode.toString());
    await page.waitForTimeout(500);
    await modalInput.press('Enter');
    await page.waitForTimeout(2000);

    const resultItem = page.locator('.tingle-modal--visible .hyu-postcode-modal--location-list li').first();
    if ((await resultItem.count()) > 0 && (await resultItem.isVisible().catch(() => false))) {
      const text = await resultItem.textContent().catch(() => '');
      console.log(`📍 Selecting first result: "${text.trim()}"`);
      await resultItem.click();
      await page.waitForTimeout(3000);

      const setDealerBtn = page.locator(
        '.tingle-modal--visible .js-hyu-postcode-modal--btn-set-dealer, ' +
        '.tingle-modal--visible button:has-text("Set dealer")'
      ).first();
      if ((await setDealerBtn.count()) > 0 && (await setDealerBtn.isVisible().catch(() => false))) {
        await setDealerBtn.click();
        await page.waitForTimeout(2000);
        console.log('📍 Clicked Set dealer — modal dismissed');
      }
    } else {
      console.log('⚠️ No results found after Enter — pressing Escape');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }
  } else {
    console.log('⚠️ No visible modal input found — pressing Escape');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  }
}

/**
 * Build a submission-failure message with the actual culprit LEADING the first
 * line — reports (and terminal output) show that first line as the bold
 * headline, so burying "the Powertrain dropdown is empty" a few lines down
 * under a generic "submission not confirmed" headline is what made it easy
 * to miss. Falls back to a plain "not confirmed" headline when no specific
 * field issue was found.
 */
export function formatSubmissionFailure(label, issues, contextLines = []) {
  const lead = issues.length
    ? `${label} — likely cause: ${issues[0]}`
    : `${label} — no confirmation appeared and no specific field issue was detected`;
  const otherIssues = issues.length > 1
    ? [`Other issue(s) also found: ${issues.slice(1).join(' | ')}`]
    : [];
  return [lead, ...contextLines, ...otherIssues]
    .map((line, i) => (i === 0 ? line : `  ${line}`))
    .join('\n');
}

/**
 * Text that genuinely indicates a submission completed. Deliberately excludes
 * bare words like "confirm" or "enquiry" — those show up on an UN-submitted
 * form too (a "Confirm booking" button, an "I confirm..." consent checkbox
 * label, a "Review your enquiry" heading), and matching on them alone is what
 * caused submission-check steps to pass even when the form never actually
 * went through.
 */
export const SUCCESS_TEXT_RE =
  /all done|thank you|thanks (for|,)|we'?ll be in touch|request received|(enquiry|booking|request) (has been |request )?(received|submitted|confirmed)|submitted successfully/i;

/**
 * Inspect a submission form/modal for the specific field(s) blocking
 * submission, so a failed assertion can name the culprit instead of just
 * saying "not successful". Checks, in order:
 *   1. Model / Powertrain dropdowns rendered with no selectable options
 *      (a common root cause — the required field can never be filled).
 *   2. Required text inputs (name/email/phone) left empty or flagged
 *      invalid by the site's own validation.
 *   3. Consent checkboxes left unchecked.
 *   4. Any other visible inline validation/error text as a catch-all.
 * Returns an array of human-readable strings; empty if nothing was found
 * (the caller should say so rather than imply a field problem exists).
 */
export async function describeFieldIssues(modal) {
  const issues = [];
  if (!modal) return issues;

  const dropdowns = [
    { selectors: 'select[name="ModelOfinterest__c"], select[id*="model" i]', label: 'Model' },
    { selectors: 'select[name="FuelType__c"], select[id*="energy" i], select[id*="powertrain" i], select[id*="fuel" i]', label: 'Powertrain' },
  ];
  for (const { selectors, label } of dropdowns) {
    const el = modal.locator(selectors).first();
    if ((await el.count().catch(() => 0)) === 0 || !(await el.isVisible().catch(() => false))) continue;
    // Options are lazy-loaded (Vue), so a dropdown checked the instant it renders
    // can look empty even though it fills in shortly after — give it a chance
    // to populate before concluding it's genuinely stuck empty.
    await el.locator('option').nth(1).waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});
    const options = (await el.locator('option').allTextContents().catch(() => [])).map(o => o.trim()).filter(Boolean);
    const selectable = options.filter(o => !/^select|^please choose|^choose|^--/i.test(o));
    if (selectable.length === 0) {
      issues.push(`the ${label} dropdown has no selectable options${options.length ? ` (only placeholder text: "${options.join(', ')}")` : ' (it is empty)'} — this required field could not be filled, so the form is blocked from submitting`);
    } else if (!(await el.inputValue().catch(() => ''))) {
      issues.push(`the ${label} dropdown has options but none is selected`);
    }
  }

  const textFields = [
    { selectors: 'input[name*="first" i]', label: 'First Name' },
    { selectors: 'input[name*="last" i]', label: 'Last Name' },
    { selectors: 'input[type="email"], input[name*="email" i]', label: 'Email Address' },
    { selectors: 'input[type="tel"], input[name*="phone" i]', label: 'Phone Number' },
  ];
  for (const { selectors, label } of textFields) {
    const el = modal.locator(selectors).first();
    if ((await el.count().catch(() => 0)) === 0 || !(await el.isVisible().catch(() => false))) continue;
    const value = (await el.inputValue().catch(() => '')).trim();
    const ariaInvalid = await el.getAttribute('aria-invalid').catch(() => null);
    const cls = (await el.getAttribute('class').catch(() => '')) || '';
    if (!value) issues.push(`${label} is empty`);
    else if (ariaInvalid === 'true' || /is-invalid|invalid|error/i.test(cls)) issues.push(`${label} is marked invalid by the form (current value: "${value}")`);
  }

  const checkboxes = await modal.locator('input[type="checkbox"]').all().catch(() => []);
  for (let i = 0; i < checkboxes.length; i++) {
    const cb = checkboxes[i];
    if (!(await cb.isVisible().catch(() => false))) continue;
    if (!(await cb.isChecked().catch(() => false))) {
      const name = (await cb.getAttribute('name').catch(() => ''))
        || (await cb.getAttribute('id').catch(() => ''))
        || `checkbox #${i + 1}`;
      issues.push(`consent checkbox "${name}" is not checked`);
    }
  }

  const genericErrors = (await modal
    .locator('.error:visible, [class*="error"]:visible, [class*="invalid"]:visible, .invalid-feedback:visible')
    .allInnerTexts().catch(() => [])).map(t => t.trim()).filter(Boolean);
  genericErrors.forEach(t => issues.push(`visible validation message: "${t}"`));

  return issues;
}

/**
 * Click a variant tile on the Hyundai consumer calculator
 * (e.g. "VENUE Active"). Tries exact text, role-based, then fuzzy.
 */
export async function selectConsumerVariant(page, variant) {
  console.log(`🖱️  Selecting variant on calculator: ${variant}`);
  const escRe = variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const candidates = [
    page.getByText(variant, { exact: true }),
    page.getByText(new RegExp(`^\\s*${escRe}\\s*$`, 'i')),
    page.getByRole('button', { name: new RegExp(escRe, 'i') }),
    page.getByRole('link', { name: new RegExp(escRe, 'i') }),
    page.getByText(new RegExp(escRe, 'i')),
  ];
  let target = null;
  for (const loc of candidates) {
    const first = loc.first();
    try {
      await first.waitFor({ state: 'visible', timeout: 4000 });
      target = first;
      break;
    } catch { /* try next */ }
  }
  if (!target) {
    const samples = await page.evaluate(() => {
      const out = []; const seen = new Set();
      document.querySelectorAll('button, a, h2, h3, h4, [role="button"], div, span').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        let t = '';
        for (const n of el.childNodes) if (n.nodeType === 3) t += n.nodeValue;
        t = t.trim();
        if (!t || t.length > 60 || seen.has(t)) return;
        seen.add(t); out.push(t);
      });
      return out.slice(0, 40);
    }).catch(() => []);
    throw new Error(`Could not find variant "${variant}" on the consumer calculator. Visible candidates: ${JSON.stringify(samples)}`);
  }
  await target.scrollIntoViewIfNeeded().catch(() => {});
  await Promise.all([
    page.waitForResponse(r => /variantpricecalc/i.test(r.url()) && r.ok(), { timeout: 30000 }).catch(() => null),
    target.click({ timeout: 8000 }),
  ]);
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
}

/**
 * Click a non-variant option on the Hyundai consumer calculator
 * (powertrain, transmission, option pack value, etc.).
 */
export async function selectConsumerOption(page, label) {
  console.log(`🖱️  Selecting option on calculator: ${label}`);
  const escRe = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const exactRe = new RegExp(`^\\s*${escRe}\\s*$`, 'i');
  const candidates = [
    page.getByRole('button', { name: exactRe }),
    page.getByRole('radio', { name: exactRe }),
    page.getByRole('link', { name: exactRe }),
    page.getByText(label, { exact: true }),
    page.getByText(exactRe),
  ];
  let target = null;
  for (const loc of candidates) {
    const first = loc.first();
    try {
      await first.waitFor({ state: 'visible', timeout: 4000 });
      target = first;
      break;
    } catch { /* try next */ }
  }
  if (!target) {
    const samples = await page.evaluate(() => {
      const out = []; const seen = new Set();
      document.querySelectorAll('button, a, h2, h3, h4, [role="button"], [role="radio"], div, span').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        let t = '';
        for (const n of el.childNodes) if (n.nodeType === 3) t += n.nodeValue;
        t = t.trim();
        if (!t || t.length > 60 || seen.has(t)) return;
        seen.add(t); out.push(t);
      });
      return out.slice(0, 60);
    }).catch(() => []);
    throw new Error(`Could not find consumer option "${label}". Visible candidates: ${JSON.stringify(samples)}`);
  }
  await target.scrollIntoViewIfNeeded().catch(() => {});
  await Promise.all([
    page.waitForResponse(r => /variantpricecalc/i.test(r.url()) && r.ok(), { timeout: 10000 }).catch(() => null),
    target.click({ timeout: 8000 }),
  ]);
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
}
