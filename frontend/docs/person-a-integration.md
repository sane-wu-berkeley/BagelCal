# Person A handoff — contract version 1.0

Implement `POST /analyze`, receiving the example in `examples/decision.json` with `mode` and `analysis_source` omitted. The response must match `contracts/analysis-response.schema.json`. Start from `examples/analysis-response.json` to test transport. Set the top-level service source to `person_a`, while retaining `illustrative` on synthetic evidence entries.

## Request

- `schema_version`: `1.0`
- `question`, `profile`, `philosophy`: reviewed text, no raw PDF
- `options`: 2–5 `{id, label, feasible}` objects. Preserve IDs exactly. At least two must be feasible.
- `weights`: security, growth, autonomy, connection, meaning; nonnegative and sum to one
- `risk_aversion`: 0–3

## Response

- `schema_version`: `1.0`; `source`: `person_a`
- `suggested_weights`: same five keys, sum to one. Suggestions do not overwrite user input.
- `actions`: exactly one per input option ID. Include expected_utility, expected_regret, tail_regret, score, criteria, timeline, evidence_ids.
- Utilities, regrets, criterion values: 0–1 normalized points. Score: −3 to 1. Never use percent strings.
- `timeline`: years 1, 5, 20 exactly once, each with a regret in normalized points.
- `uncertainty`: kind (`scenario` or `estimated`), description, sample_count (positive integer or null).
- `evidence`: unique IDs with label, kind, source, year (or null), population, geography. Action references must resolve.
- `assumptions` and `method`: explicit descriptions of calculations, sampling, time aggregation, tie handling, hard constraints, and CVaR level.

Rankings use your supplied `score` for feasible options. Keep it consistent with the user weights and risk penalty; explain any differences. The UI shows Drex's decision separately and flags disagreement. Do not claim empirical uncertainty for synthetic input.

## Local connection

Set `ANALYSIS_URL=http://<person-a-host>:8000/analyze` in the Next.js server environment. Use HTTPS and authentication for a shared network service. `ANALYSIS_API_TOKEN` becomes a Bearer header, if configured. The browser never chooses a backend URL or sees this token.

The response is rejected on an unsupported schema version, missing/duplicate option IDs, invalid numeric ranges, non-normalized suggested weights, duplicated horizons, or unresolved evidence references. Service errors remain errors, without mock substitution.

## Working reference service

Run `npm run analysis:serve` in a separate terminal. This starts a working `POST http://127.0.0.1:8000/analyze` endpoint using the same local scenario calculation and validation as the app. It reports transport source `person_a` but its evidence and assumptions explicitly identify the bundled reference implementation. It is not Person A's statistical engine.

Set `ANALYSIS_URL=http://127.0.0.1:8000/analyze`, restart the frontend, and choose the connected-service mode to test the complete transport. The reference service binds only to loopback. Stop it before starting another service on port 8000. Person A can implement the same contract in Python and replace only the endpoint URL. No frontend changes are needed.

Optional request field `scenario_inputs` contains exactly one entry per option: `option_id`, `spread` (0–0.5), and `horizons` (years 1, 5, 20 with five criterion scores each, all 0–1). The local app only sends these as user-provided numerical evidence in reviewed mode. A remote service should document whether it uses or replaces these inputs. Preserve provenance and do not relabel subjective inputs as observed data.

For Windows, Node.js and Ollama can run this same frontend. Person A's original Streamlit UI does not have to be started. The provided `ndi.py` implementation was never supplied, so it is not a dependency of this project.
