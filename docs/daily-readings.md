# Daily reading desk

The daily desk uses this chat's scheduled Codex run and its authorized subagents
to write a finite batch. Visitors receive ordinary static JSON. No public
request uses the owner's ChatGPT credentials or starts a model call.

## Calendar and output

Each batch covers one calendar day in `America/New_York`. All stored timestamps
are UTC with a `Z` suffix; daylight saving days may have 23 or 25 hours.
`public/readings/YYYY-MM-DD.json` is both the published catalog and the durable
record used to prevent recycling recent copy.

Files are published as complete validated snapshots, never as partially filled
public drafts. Keep the dated JSON catalogs separate from `src/lib/fortunes.ts`:
that module validates and selects readings, while JSON supplies daily content.
This separation makes catalogs easy to inspect, compare, and replace in forks.
The public format includes its schema version, date, validity window, source,
factual event records, and final jokes with stable IDs, event references, and
tone tags. Draft instructions and worker exchanges stay in ignored scratch
files. The owner's local schedule is configured in Codex; cloning the repository
does not create a schedule or grant access to that account. A fork can publish
its own validated catalogs or use the built-in fallback without running agents.

The planner includes every interval intersecting that day for:

- Sun and planetary sign placements, the Moon's sign, retrogrades, and the
  existing phase windows.
- Conjunctions among the same bodies plus the Moon. The declared convention is
  a separation of at most **3 degrees in geocentric tropical ecliptic
  longitude**. This is an angular-longitude convention, not a claim that the
  bodies overlap visually or physically interact.

Conjunctions are calculated from Moshier positions, sampled hourly and refined
to the existing generator's sub-second crossing precision. Their validity
windows are clipped to the daily batch. Existing event IDs, source metadata,
and facts are preserved. A conjunction that ends in the morning cannot appear
in an afternoon real reading. Houses, birth charts, other aspect angles, and
claims of personal causation are outside this desk's scope.

For each event interval, commission two jokes in each voice:

| Voice | Target |
| --- | --- |
| `tech` | Software teams, hype, overengineering, tickets, and delivery habits |
| `woo` | Spiritual consumerism, manifesting, premium enlightenment, and vibes |
| `zen` | Dry acceptance and absurd practical wisdom; allow both camps a turn |

Daily yield is `event intervals × 3 voices × 2 jokes`. October 28, 2026 has
16 assignments and yields 96 lines. In 2026 the existing monthly event types
alone give 10–16 simultaneous assignments at 16:00 UTC (60–96 lines); day-long
coverage can add intervals when an event changes, and conjunctions add six
lines each. There are 45 possible body pairs, but only actual close pairs are
conjunction assignments. Do not commission every mathematical combination of
the whole sky.

## Planner, writers, and editor

The scheduled parent agent is the planner and final editor. It must explicitly
delegate the writing to three subagents, one per voice, with narrow factual
records for each assignment. More writers can be used in sequential batches
when needed, keeping concurrency within the host's available slots. Use the
chat's configured model unless the owner requests a specific model.

1. Run the `plan` command. It recalculates the sky, rather than asking a model
   to infer positions or treating manually edited facts as authoritative.
2. Read the assignments and add an `editorialFocus` to each scratch record:
   one concrete comic tension grounded in that event. A planetary placement,
   a retrograde of that planet, and a conjunction are different assignments.
   The traditional association supplies a comic theme, never evidence about
   someone's life.
3. Give each writer the event ID, title, fact, validity, editorial focus, its
   assigned voice, and a recent-copy exclusion list. Each row is its own
   narrow context. Do not combine unrelated events just because they are in
   the same input file.
4. Each writer saves an array of `{eventId, tone, text}` objects. Require two
   lines per event for its voice. Use UTF-8 JSON and real punctuation.
5. Review all drafts together. Reject filler, repeated constructions,
   mismatched events, sign changes presented as happening today, unearned
   factual claims, and personal diagnoses or predictions. Prefer specific
   punchlines over variations of “fill out a form.” Ask the assigned writer
   for replacements when needed.
6. Publish only after the deterministic validator accepts the complete batch.

Every text must be nonempty, one or two sentences, at most **80 Unicode
characters**, and free of embedded line breaks or markup. Keep the weary
cosmic-clerk voice. The title already names the event. Jokes may play with the
specific sign's themes, but must not misstate the supplied fact. Exact
duplicates normalized for case, punctuation, and whitespace are rejected
within the batch and against the preceding 30 daily catalogs; the editor also
checks for semantic repetition and copied static-catalog lines.

## Commands

Use Python 3.12 with `requirements.txt` installed. On this Windows checkout the
interpreter is `.venv/Scripts/python.exe`; on other hosts use the configured
project interpreter. Use Node 24 for the site checks.

```sh
python scripts/daily_readings.py plan --date YYYY-MM-DD --out test-results/daily/plan.json
python scripts/daily_readings.py publish --plan test-results/daily/plan.json --drafts test-results/daily/tech.json test-results/daily/woo.json test-results/daily/zen.json --out public/readings/YYYY-MM-DD.json
python scripts/daily_readings.py validate --file public/readings/YYYY-MM-DD.json
python -m unittest discover -s tests -p 'test_*.py'
npm test
npm run check
npm run build
```

Scratch plans, drafts, and revisions belong under the ignored `test-results/`
directory. Do not commit them. The published catalog contains factual events
and final jokes; it does not contain worker instructions or draft exchanges.
The publication command recomputes the factual plan, checks completeness and
copy, and writes atomically. Fix failed validation; do not waive it or replace
missing writer output with generic templates.

## Daily publication procedure

The owner authorized the scheduled desk to commit and push validated daily
catalogs directly to `main` in `ScionV/cosmicbullshit`. This authorization is
limited to the daily catalogs; it does not authorize unrelated code changes,
credentials, visibility changes, or modifying another person's work.

- Determine the target date using `America/New_York`, never the machine's
  assumed local date. If today's complete valid catalog already exists on
  `origin/main`, finish without creating another batch or commit. An existing
  invalid or incomplete catalog requires repair and validation.
- Refresh `origin/main` before starting. Prefer a suitable clean, task-owned
  worktree; otherwise create a managed worktree from the fetched remote main.
  Keep ongoing user work in the primary checkout intact. Use the worktree's
  returned absolute directory for all edits.
- Install or reuse the pinned project dependencies. Never put a ChatGPT login
  token or personal API key in GitHub Actions or the website. The scheduled
  chat and its subagents perform the writing through the app.
- Run the plan, writers, editing, publication, and checks above. Stage only the
  target daily catalog. Review the staged diff and confirm it contains no
  unexpected files or changed factual records.
- Commit with `Publish cosmic readings for YYYY-MM-DD`. Push that commit to
  `origin/main` without force. If another commit wins the race, fetch the new
  main and reapply only the daily catalog; if someone already published a valid
  batch for the same date, keep theirs. Revalidate before retrying once.
- Verify the remote branch contains the published commit. Archive a managed
  worktree created for the run when it is no longer needed.
- Keep a concise completion record with date, event count, line count, and
  commit link. On missing credentials, denied access, dependency failures, or
  failed checks, keep the draft recoverable and report the required action;
  do not claim the upload succeeded.

The daily schedule is shortly after midnight New York time. Local scheduled
runs require the computer to be on and the Codex app running. If a run is late,
missed, or fails, the site keeps its existing monthly-data and invented-copy
fallbacks. It never treats an old daily batch as current. After a successful
GitHub push, the connected hosting service still needs to complete its normal
deployment before the new file is available to visitors.

## Browser behavior

The client checks the New York date and loads its daily catalog alongside the
monthly calendar. Real readings use the daily copy when a valid batch is
available, using a 90/10 split with invented nonsense and the uniform
kind/event/joke selection. The current event's exact time window still decides
eligibility. Missing, malformed, stale, or incomplete daily data falls back to
the monthly catalog. The existing slip and source disclosure show the result.
