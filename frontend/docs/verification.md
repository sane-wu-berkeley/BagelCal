# Final verification — November 14, 2026

- Production build and TypeScript: passed after the final advisor correction.
- ESLint: passed.
- Automated tests: 10 passed, covering input contracts, feasibility, exact regret/CVaR arithmetic, order invariance, remote validation, request protections, and exclusion of sample estimates from live model context.
- Final real browser run: four Qwen advisor drafts, Drex selections for all four advisors, and final Drex arbitration succeeded in 43.2 seconds using 5,482 Drex input tokens. Saved in `evidence/final-browser-evaluation.json`. This was a fictional test decision; model output is not a validation of future life outcomes.
- Earlier reviewed-input API run: 44.944 seconds / 5,315 Drex input tokens. The final browser run uses the tightened qualitative advisor prompt.
- NDI: real extraction of the bundled synthetic PDF returned profile fields and page citations. Reported charge: $0.012. Temporary job/file deletion requests succeeded; request success is not a retention guarantee.
- Intern 0.30.1: real verification completed, 10 tests passed, 3 System One asks / 0 failed. Redacted original execution log and compact summary included. The later qualitative prompt correction was checked with tests, build, and the final browser run.
- Working reference `/analyze` endpoint: actual HTTP adapter test passed. This does not mean Person A’s computer is connected.
- HTTP checks: method 405, invalid body 400, cross-origin 403, and numerical endpoint 200. Prior checks also exercised missing NDI consent and concurrent-run rejection.
- UI review: source selection, review requirement, local numerical update, input locking during live runs, final result download, and advisor/Drex disagreements were exercised. Sample spread slider step was corrected to retain the displayed 0.18 value.

The browser test caught an advisor claiming lower regret at every horizon, which was not supported by the table. The final advisor prompt asks for qualitative, role-specific reasoning; exact utility/regret comparisons remain in the computed table. Generated prose remains an interpretation and can be wrong.

This is a local hackathon MVP. It requires local Ollama and server-side Nace credentials. Public hosting, authentication for multiple users, population-calibrated life forecasts, and organizer acceptance are not claimed. Person A can replace the analysis endpoint through the documented schema.

Public logs redact configured credentials and the local user home path. The presentation contains seven visually reviewed slides and an editable chart; PPTX package/layout/import checks passed.
