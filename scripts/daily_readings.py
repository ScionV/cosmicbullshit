"""Plan factual daily writing assignments and publish checked joke batches.

SPDX-License-Identifier: AGPL-3.0-only
The planner uses local Moshier calculations. Joke authors never supply sky facts.
"""
import argparse
from collections import Counter, defaultdict
from copy import deepcopy
from datetime import date, datetime, time, timedelta
from functools import lru_cache
from itertools import combinations
import json
import os
from pathlib import Path
import tempfile
import unicodedata
from zoneinfo import ZoneInfo

import swisseph as swe

from generate_sky import SIGN_BODIES, UTC, event, generate_month, intervals, iso, month_after, position

DAY_ZONE = "America/New_York"
TONES = ("tech", "woo", "zen")
JOKES_PER_TONE = 2
CONJUNCTION_ORB = 3
CONJUNCTION_BODIES = {**SIGN_BODIES, "Moon": swe.MOON}
ENVELOPE_KEYS = ("schemaVersion", "date", "validFrom", "validUntil", "source", "events")


def parse_day(value):
    """Require a canonical date so filenames and validity windows agree."""
    if not isinstance(value, str):
        raise ValueError("Date must be YYYY-MM-DD")
    try:
        parsed = date.fromisoformat(value)
    except ValueError as error:
        raise ValueError("Date must be YYYY-MM-DD") from error
    if parsed.isoformat() != value:
        raise ValueError("Date must be YYYY-MM-DD")
    return parsed


def day_window(value):
    day = parse_day(value)
    zone = ZoneInfo(DAY_ZONE)
    start = datetime.combine(day, time(), zone).astimezone(UTC)
    end = datetime.combine(day + timedelta(days=1), time(), zone).astimezone(UTC)
    return start, end


@lru_cache(maxsize=6)
def calculated_month(year, month):
    # Recalculate rather than allowing an edited JSON file to introduce facts.
    return generate_month(datetime(year, month, 1, tzinfo=UTC))


def angular_separation(first, second):
    """Smallest separation in tropical longitude, including the 0/360 cusp."""
    return abs((first - second + 180) % 360 - 180)


def conjunction_events(start, end):
    @lru_cache(maxsize=8192)
    def longitude(when, body):
        return position(when, body)[0]

    found = []
    for (first, first_body), (second, second_body) in combinations(CONJUNCTION_BODIES.items(), 2):
        def is_close(when):
            return angular_separation(longitude(when, first_body), longitude(when, second_body)) <= CONJUNCTION_ORB

        def make_conjunction(close, a, b):
            if not close or a >= b:
                return None
            result = event("conjunction", f"{first} conjunct {second}", a, b,
                f"The geocentric tropical ecliptic longitudes of {first} and {second} "
                f"differ by at most {CONJUNCTION_ORB} degrees.")
            result.update(id=f"conjunction-{first}-{second}-{iso(a)}",
                          bodies=[first, second], orbDegrees=CONJUNCTION_ORB)
            return result

        found.extend(intervals(start, end, is_close, make_conjunction, step=timedelta(hours=1)))
    return found


def event_title(item):
    if item["kind"] == "retrograde":
        return f"{item['subject']} is retrograde"
    if item["kind"] == "moon-sign":
        return f"Moon in {item['subject']}"
    if item["kind"] == "moon-phase":
        return f"Near the {item['subject']}"
    if item["kind"] == "planet-sign":
        return f"{item['subject']} in {item['sign']}"
    return item["subject"]


def make_plan(value):
    start, end = day_window(value)
    cursor = datetime(start.year, start.month, 1, tzinfo=UTC)
    events = []
    source = None
    while cursor < end:
        month = calculated_month(cursor.year, cursor.month)
        if source is not None and source != month["source"]:
            raise ValueError("Calculation source differs across month boundary")
        source = deepcopy(month["source"])
        events.extend(deepcopy(item) for item in month["events"]
                      if datetime.fromisoformat(item["startsAt"]) < end
                      and datetime.fromisoformat(item["endsAt"]) > start)
        cursor = month_after(cursor)
    events.extend(conjunction_events(start, end))
    events.sort(key=lambda item: (item["startsAt"], item["id"]))
    if len({item["id"] for item in events}) != len(events):
        raise ValueError("Calculated event IDs are not unique")
    assignments = [{"eventId": item["id"], "title": event_title(item), "kind": item["kind"],
                    "fact": item["fact"], "startsAt": item["startsAt"], "endsAt": item["endsAt"],
                    "tones": list(TONES), "jokesPerTone": JOKES_PER_TONE} for item in events]
    return {"schemaVersion": 1, "date": value, "validFrom": iso(start), "validUntil": iso(end),
            "source": source, "events": events, "assignments": assignments,
            "summary": {"events": len(events), "byKind": dict(sorted(Counter(e["kind"] for e in events).items())),
                        "jokesPerEvent": len(TONES) * JOKES_PER_TONE,
                        "expectedReadings": len(events) * len(TONES) * JOKES_PER_TONE}}


def validate_plan(plan):
    if not isinstance(plan, dict) or type(plan.get("schemaVersion")) is not int:
        raise ValueError("Plan must be a versioned JSON object")
    calculated = make_plan(plan.get("date"))
    for key in ENVELOPE_KEYS:
        if plan.get(key) != calculated[key]:
            raise ValueError(f"Plan {key} differs from the calculated sky")
    return calculated


def normalized_text(text):
    return "".join(character for character in unicodedata.normalize("NFKC", text).casefold()
                   if character.isalnum())


def previous_texts(directory, target_day):
    """Reject recycled copy from the preceding 30 days, excluding a same-day retry."""
    target = parse_day(target_day)
    earliest = target - timedelta(days=30)
    found = set()
    if not directory.exists():
        return found
    for path in sorted(directory.glob("*.json")):
        try:
            other_day = parse_day(path.stem)
        except ValueError:
            continue
        if not earliest <= other_day < target:
            continue
        previous = read_json(path)
        if not isinstance(previous, dict) or not isinstance(previous.get("readings"), list):
            raise ValueError(f"Invalid reading history: {path.name}")
        for reading in previous["readings"]:
            if not isinstance(reading, dict) or not isinstance(reading.get("text"), str):
                raise ValueError(f"Invalid reading history: {path.name}")
            found.add(normalized_text(reading["text"]))
    return found


def make_batch(plan, drafts, history_directory):
    calculated = validate_plan(plan)
    event_ids = {item["id"] for item in calculated["events"]}
    history = previous_texts(Path(history_directory), calculated["date"])
    used = set()
    grouped = defaultdict(list)
    if not isinstance(drafts, list):
        raise ValueError("Drafts must be a JSON array")
    for draft in drafts:
        if not isinstance(draft, dict) or set(draft) != {"eventId", "tone", "text"}:
            raise ValueError("Each draft needs exactly eventId, tone, and text")
        event_id, tone, text = draft["eventId"], draft["tone"], draft["text"]
        if not isinstance(event_id, str) or event_id not in event_ids:
            raise ValueError(f"Unknown event ID: {event_id}")
        if not isinstance(tone, str) or tone not in TONES:
            raise ValueError(f"Unknown writing tone: {tone}")
        if not isinstance(text, str) or not 1 <= len(text) <= 80 or text != text.strip() or not text.isprintable():
            raise ValueError("Each joke must be 1–80 printable characters without surrounding whitespace")
        normalized = normalized_text(text)
        if not normalized or normalized in used or normalized in history:
            raise ValueError(f"Duplicate or empty joke: {text}")
        used.add(normalized)
        grouped[event_id, tone].append(text)
    readings = []
    for item in calculated["events"]:
        for tone in TONES:
            texts = sorted(grouped[item["id"], tone], key=normalized_text)
            if len(texts) != JOKES_PER_TONE:
                raise ValueError(f"Need exactly {JOKES_PER_TONE} {tone} jokes for {item['id']}; found {len(texts)}")
            for index, text in enumerate(texts):
                readings.append({"id": f"daily-{calculated['date']}-{item['id']}-{tone}-{index}",
                                 "eventId": item["id"], "tone": tone, "text": text})
    return {**{key: calculated[key] for key in ENVELOPE_KEYS}, "readings": readings}


def read_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, ValueError) as error:
        raise ValueError(f"Cannot read JSON from {path}: {error}") from error


def write_json_atomic(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", newline="\n", dir=path.parent,
                                         prefix=path.name + ".", suffix=".tmp", delete=False) as output:
            temporary = Path(output.name)
            json.dump(value, output, indent=2, ensure_ascii=False)
            output.write("\n")
        os.replace(temporary, path)
    finally:
        if temporary is not None and temporary.exists():
            temporary.unlink()


def publish(plan_path, draft_paths, output_path):
    plan = read_json(plan_path)
    drafts = []
    for path in draft_paths:
        items = read_json(path)
        if not isinstance(items, list):
            raise ValueError(f"Draft file must contain a JSON array: {path}")
        drafts.extend(items)
    output = Path(output_path)
    if not isinstance(plan, dict) or output.name != f"{plan.get('date')}.json":
        raise ValueError("Output filename must match the plan date: YYYY-MM-DD.json")
    batch = make_batch(plan, drafts, output.parent)
    write_json_atomic(output, batch)
    return batch


def validate_batch(path):
    batch = read_json(path)
    if not isinstance(batch, dict) or not isinstance(batch.get("readings"), list):
        raise ValueError("Batch must contain a readings array")
    drafts = []
    for reading in batch["readings"]:
        if not isinstance(reading, dict) or set(reading) != {"id", "eventId", "tone", "text"}:
            raise ValueError("Invalid published reading")
        drafts.append({key: reading[key] for key in ("eventId", "tone", "text")})
    expected = make_batch(batch, drafts, Path(path).parent)
    if batch != expected:
        raise ValueError("Published batch differs from validated content or stable IDs")
    if Path(path).name != f"{batch['date']}.json":
        raise ValueError("Batch filename must match its date")
    return expected


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    plan_command = commands.add_parser("plan", help="Calculate one local day's factual writing assignments")
    plan_command.add_argument("--date", default=datetime.now(ZoneInfo(DAY_ZONE)).date().isoformat())
    plan_command.add_argument("--out", type=Path, required=True)
    publish_command = commands.add_parser("publish", help="Validate all drafts before atomically publishing")
    publish_command.add_argument("--plan", type=Path, required=True)
    publish_command.add_argument("--drafts", type=Path, nargs="+", required=True)
    publish_command.add_argument("--out", type=Path, required=True)
    validate_command = commands.add_parser("validate", help="Recheck a published daily batch")
    validate_command.add_argument("--file", type=Path, required=True)
    args = parser.parse_args()
    try:
        if args.command == "plan":
            plan = make_plan(args.date)
            write_json_atomic(args.out, plan)
            print(f"Planned {plan['summary']['events']} events and {plan['summary']['expectedReadings']} readings "
                  f"for {args.date} ({DAY_ZONE}) in {args.out}")
        elif args.command == "publish":
            batch = publish(args.plan, args.drafts, args.out)
            print(f"Published {len(batch['readings'])} checked readings to {args.out}")
        else:
            batch = validate_batch(args.file)
            print(f"Validated {len(batch['readings'])} readings in {args.file}")
    except (ValueError, RuntimeError) as error:
        parser.exit(1, f"Error: {error}\n")


if __name__ == "__main__":
    main()
