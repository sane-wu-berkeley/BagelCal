# Regret Simulator

A local, unified Next.js app for a parliament of four future selves. Qwen 3 writes structured perspectives. Drex selects each advisor's action, then arbitrates the four positions. Numerical analysis is separately attributed.

## Run locally

1. Install Node.js 20+ and Ollama. Run `ollama pull qwen3:8b` and start Ollama.
2. Run `npm ci`. Copy `.env.example` to `.env.local` and set the server-only `NACE_API_KEY`.
3. Run `npm run build`, then `npm start -- --hostname 127.0.0.1 --port 3019`.
4. Open http://127.0.0.1:3019. Live mode uses real Qwen and Drex. Demo mode uses labeled fixtures.

The current machine already has the key and model configured. No secrets are shipped in example files. This is a local demonstration server; add authentication and a shared rate limiter before public deployment.

## What works

- Editable profile, 2–5 options, feasibility constraints, five normalized preference weights, and downside-regret penalty.
- Optional NDI PDF extraction (2 MB max) with explicit consent, editable review, and citations. The app requests deletion of its temporary NDI file and job after extraction. Profile application requires the user to review it.
- Four independent Qwen contexts: Future, Rational, Wisdom, Relationship. Structured responses are validated and evidence references checked.
- Drex action selection for all four advisors in one typed-question request; a separate final arbitration receives all selected positions and their preliminary arguments.
- Both the Qwen preliminary proposal and Drex selection are visible, including disagreements. Advisor prose explains the preliminary proposal and must not be mistaken for a justification of a different Drex selection.
- Utility/regret table and 1/5/20-year scenario bars, explicit source/method labels, and downloadable results.
- Person A adapter with strict response validation. A remote error is reported and never replaced silently by a mock.

## Numerical scope

The app includes a functioning local decision-analysis engine. Each option has explicit satisfaction scores for five criteria at years 1, 5, and 20, plus a scenario spread. Users edit and review those assumptions. Sample assumptions remain marked illustrative; reviewed values are labeled subjective, never empirical. Scores are keyed to option IDs and do not depend on position in the list.

For each of three equally weighted shared states (downside, baseline, upside), criterion scores shift by minus spread, zero, or plus spread and are clipped to [0,1]. Utility is the weighted criterion sum averaged over the three horizons. Full-path regret compares each path to the best feasible fixed path in the same state. Score = mean utility − risk penalty × CVaR90(regret). With three equally weighted states, CVaR90 equals worst-state regret. The horizon bars compare paths separately at each horizon and need not average to full-path regret. Ties use option ID order.

The sensitivity table sweeps each value weight through 0%, 25%, 50%, 75%, and 100%, reallocating other weights proportionally. This is exact scenario arithmetic, not a fitted model or statistical confidence interval. No GRAB convergence claim is made. Sample numbers are excluded from both the analysis and decision fields sent to the live models; explicitly reviewed assumptions may be used, with their provenance.

The career example includes a separately labeled BLS public reference: May 2025 U.S. data-scientist median wage, $120,230 ([official OOH](https://www.bls.gov/ooh/math/data-scientists.htm), checked November 14, 2026). It is not an entry-level offer, PhD stipend, or individualized forecast and is not automatically mapped into utility or sent to advisors.

Person A's pasted Streamlit app only captures inputs and invokes an unavailable `ndi.py`; it exposes no `/analyze` service or optimizer. It was not executed on this Mac. This app replaces that input flow and provides its own tested NDI integration.

## Connect Person A

See [docs/person-a-integration.md](docs/person-a-integration.md). Set `ANALYSIS_URL` to Person A's exact `/analyze` URL, optionally set `ANALYSIS_API_TOKEN`, restart, and select **Person A · connected analysis service**. His service must be reachable from this server. A URL on another computer cannot use this machine's `localhost`.

## Verification and demo

- `npm run doctor`: check model availability and whether a server key is configured; never prints credentials.
- `npm run analysis:serve`: independently run the reference `/analyze` service on loopback port 8000.
- `npm run test:live:reviewed`: real Qwen + Drex with explicitly marked synthetic test assumptions supplied as reviewed inputs.
- `npm run test:ndi`: real NDI extraction of the bundled fictional profile PDF.
- `npm test`: deterministic arithmetic, contract, exclusions, orchestration, and request validation checks.
- `npm run test:live`: actual Qwen + Drex execution using a synthetic input. Writes a sanitized result to `evidence/live-evaluation.json`; consumes Nace credit.
- `npm run verify:intern`: real Intern harness verification, with a redacted log in `evidence/intern-verification.jsonl`.
- `npm run contracts`: regenerate portable JSON Schemas and the matching fixture.
- `npm run build` and `npm run lint`.
- [Demo script](docs/demo.md); synthetic examples in `examples/`.

API sources checked during implementation: [Drex System One](https://console.nace.ai/docs/drex/api-reference/systemone), [Ollama chat](https://docs.ollama.com/api/chat), [NDI extraction](https://console.nace.ai/docs/perception/extract), [NDI uploads](https://console.nace.ai/docs/perception/uploads).

## Release and submission

The release archive includes source, a lockfile, schemas, fictional examples, verification evidence, and presentation materials. Environment files, dependencies, build caches, private documents, the unpublished GRAB manuscript, and local Intern working files are excluded. Follow `docs/submission.md` for the prepared project description and demo. Public source: https://github.com/sane-wu-berkeley/NaceAI-Hackathon. Repository publication does not imply a hosted service or contest submission.
