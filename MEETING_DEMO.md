# Confluence Test Agent — 2-3 Minute Demo Script

> A talk track for demoing the framework in a meeting. Timings are a guide (~150 words/min).
> Tip: the live run takes a few minutes, so **have a completed run open** (Confluence page + a PDF report) to show results instantly, and only *kick off* a live run at the start.

---

## The one-liner (say this first)
> "This is a QA agent where the **test cases live in Confluence, not in code**. A business analyst ticks which tests to run, and one command drives a real browser, self-writes any missing automation, fixes its own failures, and posts a PDF report with pass/fail back onto the same Confluence page."

---

## 0:00 – 0:25 · The problem
> "Normally, automated tests live in code — only developers can change them, and results sit in some CI dashboard nobody opens. Our team's source of truth is **Confluence**: environments, URLs, test data, and which tests to run all live in tables there."

---

## 0:25 – 1:10 · What the agent does (show the Confluence page)
*Show the Confluence page with the Environment, Feature Selection, and Report columns.*
> "Everything starts here. This table says which **environment** is active — Stage or Production. This one lists the **feature files** and a simple *Run = Yes* checkbox. And there are per-environment **Report** columns.
>
> I run **one command**. The agent:
> 1. Pulls the config, test data, and feature files from Confluence,
> 2. **Auto-generates** the automation for any test step that doesn't exist yet, using Claude,
> 3. Runs it in a real Chromium browser with Playwright,
> 4. If a test fails, an **AI fix-loop** reads the error and repairs the automation — up to five tries,
> 5. Then it builds a **PDF report** and uploads it back to Confluence, updating the Report column and a green PASS or red FAIL badge."

---

## 1:10 – 2:15 · Live proof (show a report)
*Open the latest PDF from the Production Report column.*
> "Here's a real example. This test verifies **pricing integrity** — it logs into our internal ROAP admin portal, reads a car's Manufacturer List Price and Drive-Away price, then opens the public **Car Price Calculator**, finds the same vehicle by its FCAI code, and confirms the customer-facing prices match to the cent.
>
> The report shows each check pass/fail, a **screenshot** of the actual page, and the raw **API response** as evidence — so anyone can audit *why* it passed.
>
> And it scales: our Drive-Away pricing test walks **every model on the calculator** — Venue, Kona, Tucson, the full EV range — capturing every variant's price. When Hyundai changes a price, we know the same day."

---

## 2:15 – 2:40 · Why it matters (close)
> "So the value is three things:
> - **Non-developers own the tests** — change a Confluence table, no code, no deployment.
> - **It's self-healing** — the AI writes and repairs the automation, so it doesn't rot every time a page changes.
> - **Results live where the team already works** — right on the Confluence page, with screenshots and API evidence attached.
>
> One command, run against Stage or Production, and QA sign-off is a link on a wiki page."

---

## If asked to run it live
```bash
# Kick off at the very start of the demo, talk while it runs:
node scripts/agentOrchestrator.js
# Faster (reuse fetched data/steps):
node scripts/agentOrchestrator.js --skip-fetch --skip-generate
```

## Quick Q&A cheat-sheet
- **"What tech?"** — Node.js, Playwright (Chromium), Cucumber/Gherkin, Confluence REST API, Claude for step generation + auto-fix.
- **"How does it know what to test?"** — Feature files (plain-English Gherkin) + a *Run = Yes* column in Confluence; test data comes from Confluence tables.
- **"What if the site changes and a test breaks?"** — The Claude fix-loop re-reads the live page and repairs the step; anything hand-tuned can be marked `// @protected` so it's never touched.
- **"Stage vs Production?"** — Driven by the *Status = Yes* row in Confluence; the report auto-files under that environment's column.
- **"Is it flaky?"** — Locators auto-heal (text/role/aria fallbacks), and pricing is verified against the site's own API, not just scraped text.
