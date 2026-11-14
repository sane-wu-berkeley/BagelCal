# Prepared submission

## Project
Regret Simulator — A Parliament of Future Selves

## Track
Swarm Intelligence: multi-agent systems. Optional NDI document grounding is implemented.

## Short description
Regret Simulator helps a person inspect a difficult decision through four competing perspectives: Future, Rational, Wisdom, and Relationship. Local Qwen generates structured preliminary arguments. Drex chooses every advisor’s action, then arbitrates the selected positions in a second decision request. A separate numerical engine computes utility, opportunity regret, and downside risk from explicit, reviewed assumptions. Preference sensitivity shows what would change the ranking. Optional NDI extraction grounds an editable profile in a supporting PDF.

## What is distinctive
The app shows disagreement instead of hiding it: Qwen’s preliminary proposal, each Drex action, the final arbitration, and the numerical winner are separate. Sources distinguish fictional samples, subjective assumptions, and external evidence. Model confidence is not presented as a probability of life success.

## Implemented stack
Next.js 16.4.6 / React / TypeScript / Zod; local Ollama qwen3:8b; Drex System One API (`drex-latest`, observed `drex-max-v1.1`); Nace Document Intelligence; Intern 0.30.1 verification harness. No DeepInfra account is required for this local version.

## Evidence
- `evidence/live-reviewed-evaluation.json`: actual model execution on a fictional reviewed-input test case.
- `evidence/ndi-synthetic-extraction.json`: actual NDI extraction and page citations.
- `evidence/intern-verification.jsonl`: real, redacted Intern execution log.
- `evidence/reference-service-test.json`: actual HTTP contract test against the bundled reference service.
- `docs/verification.md`: final checks and limitations.

## Remaining external actions
The local project and release package do not constitute a contest submission. An organizer submission destination and team identity have not been supplied. Project repository: https://github.com/sane-wu-berkeley/NaceAI-Hackathon. Person A’s computer is not connected; the app already runs independently and accepts the agreed endpoint when available. The local app requires Ollama and a server-side Nace key; it is not a publicly hosted service.

Official event page: https://luma.com/nace-drexathon (checked November 14, 2026). The listed hard submission deadline is 3 PM Pacific and finalist demos have a five-minute limit. This file does not claim that a submission was received or accepted.
