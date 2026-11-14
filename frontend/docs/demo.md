# Two-minute demo

0:00–0:20 — Show the funded PhD versus industry example. Explain: “The difficult part is that our future selves value different things. We make those competing reasons visible.”

0:20–0:40 — Review the profile and principles. Show five preference sliders and feasibility exclusions. Optional: extract the synthetic PDF, inspect citations, then apply the reviewed draft.

0:40–1:20 — Choose Live and convene the four selves. Explain that local Qwen generates four separate structured perspectives, Drex selects each advisor's action, and a second Drex request arbitrates them. Actual latency depends on the machine and service.

1:20–1:40 — Show advisor reasons, preliminary Qwen proposals, Drex selections, and final choice. A disagreement is displayed rather than hidden. Model confidence is not a life-success probability.

1:40–2:00 — Change a preference slider and show the numerical comparison. Say: “The sample starts with fictional assumptions. I can edit each path’s estimates, review them, and calculate utility and regret. This sensitivity table shows which value weights change the ranking. The same contract accepts Person A’s analysis when his endpoint is ready.” Open methods and download the result.

Close: “The output is a choice you can inspect, with the values and assumptions that could change it.”

Evidence: `evidence/live-evaluation.json`, `evidence/ndi-synthetic-extraction.json`, `evidence/intern-verification.jsonl`, and the automated tests. Do not present synthetic scenarios as population statistics or claim that Person A's engine is connected.

## Five-minute presentation

0:00–0:35 — Introduce the difficult career choice and the different values involved.
0:35–1:15 — Show profile review, feasibility, and the four advisor roles.
1:15–2:05 — Start a live run; explain Qwen’s role and Drex’s two decision stages while it runs.
2:05–2:45 — Inspect the actual decision and any advisor disagreement.
2:45–3:40 — Open the assumption editor and sensitivity table. Clearly call the displayed test case fictional.
3:40–4:20 — Explain optional NDI extraction and show saved page citations from the synthetic PDF test.
4:20–5:00 — Show the test evidence and API contract. Close with the distinction between a model’s recommendation and the person’s own judgment.

If connectivity fails, show `evidence/live-reviewed-evaluation.json` as a **recorded live test**, or switch to labeled demo mode. Never describe a cached run as a fresh model call.
