"""Generate UTC validity windows using pyswisseph's built-in Moshier ephemeris.

SPDX-License-Identifier: AGPL-3.0-only
No network calls or external ephemeris files are needed at calculation time.
"""
import argparse
import json
from datetime import datetime, timedelta, timezone
from pathlib import Path
import swisseph as swe

UTC = timezone.utc
FLAGS = swe.FLG_MOSEPH | swe.FLG_SPEED
BODIES = {"Mercury": swe.MERCURY, "Venus": swe.VENUS, "Mars": swe.MARS,
          "Jupiter": swe.JUPITER, "Saturn": swe.SATURN, "Uranus": swe.URANUS,
          "Neptune": swe.NEPTUNE, "Pluto": swe.PLUTO}
SIGN_BODIES = {"Sun": swe.SUN, **BODIES}
SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra",
         "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
ROOT = Path(__file__).resolve().parents[1]


def iso(date):
    return date.isoformat(timespec="seconds").replace("+00:00", "Z")


def position(date, body):
    jd = swe.julday(date.year, date.month, date.day,
                   date.hour + date.minute / 60 + date.second / 3600 + date.microsecond / 3.6e9)
    values, returned = swe.calc_ut(jd, body, FLAGS)
    if not returned & swe.FLG_MOSEPH:
        raise RuntimeError("Unexpected ephemeris backend")
    return values


def month_after(date, offset=1):
    index = date.year * 12 + date.month - 1 + offset
    return datetime(index // 12, index % 12 + 1, 1, tzinfo=UTC)


def crossing(lo, hi, fn, original):
    """Locate a discrete state transition to within one second."""
    while (hi - lo).total_seconds() > 0.5:
        mid = lo + (hi - lo) / 2
        if fn(mid) == original:
            lo = mid
        else:
            hi = mid
    return hi.replace(microsecond=0)


def intervals(start, end, fn, make_event, step=timedelta(hours=3)):
    cursor, beginning, state = start, start, fn(start)
    found = []
    while cursor < end:
        following = min(cursor + step, end)
        next_state = fn(following)
        if next_state != state:
            boundary = crossing(cursor, following, fn, state)
            event = make_event(state, beginning, boundary)
            if event:
                found.append(event)
            beginning, state = boundary, next_state
        cursor = following
    event = make_event(state, beginning, end)
    if event:
        found.append(event)
    return found


def event(kind, subject, start, end, fact):
    return {"id": f"{kind}-{subject}-{iso(start)}", "kind": kind,
            "subject": subject, "startsAt": iso(start), "endsAt": iso(end), "fact": fact}


def sign_ingress(start, body, sign):
    """Find the latest entry, including a return across a retrograde cusp."""
    sign_at = lambda d: int(position(d, body)[0] // 30)
    # crossing() rounds to seconds; probe just inside the new interval.
    hi = start + timedelta(seconds=1)
    limit = hi - timedelta(days=36525)
    while hi > limit:
        batch_start = max(hi - timedelta(days=5), limit)
        # Inspect each five-day batch at the interval sampler's resolution:
        # a short retrograde excursion can leave and return within five days.
        while hi > batch_start:
            lo = max(hi - timedelta(hours=3), batch_start)
            previous = sign_at(lo)
            if previous != sign:
                return crossing(lo, hi, sign_at, previous)
            hi = lo
    raise RuntimeError(f"No sign ingress found within 100 years for body {body}")


def planet_sign_event(name, body, sign, start, end):
    ingress = sign_ingress(start, body, sign)
    return {**event("planet-sign", name, start, end,
                   f"{name} has been in tropical {SIGNS[sign]} since {ingress:%Y-%m-%d} (geocentric zodiac)."),
            "sign": SIGNS[sign]}


def generate_month(start):
    end = month_after(start)
    events = []
    for name, body in BODIES.items():
        events.extend(intervals(start, end,
            lambda d, body=body: position(d, body)[3] < 0,
            lambda retro, a, b, name=name: event("retrograde", name, a, b,
                f"{name} is in apparent retrograde motion as seen from Earth.") if retro else None))
    for name, body in SIGN_BODIES.items():
        events.extend(intervals(start, end,
            lambda d, body=body: int(position(d, body)[0] // 30),
            lambda sign, a, b, name=name, body=body: planet_sign_event(name, body, sign, a, b)))
    events.extend(intervals(start, end, lambda d: int(position(d, swe.MOON)[0] // 30),
        lambda sign, a, b: event("moon-sign", SIGNS[sign], a, b,
            f"The Moon is in tropical {SIGNS[sign]} (geocentric zodiac)."), timedelta(hours=1)))
    # Phase windows are defined by elongation, never confused with illumination.
    def phase_window(date):
        angle = (position(date, swe.MOON)[0] - position(date, swe.SUN)[0]) % 360
        nearest = round(angle / 90) % 4
        target = nearest * 90
        separation = abs((angle - target + 180) % 360 - 180)
        return nearest if separation <= 9 else -1
    phases = ["new Moon", "first-quarter Moon", "full Moon", "last-quarter Moon"]
    events.extend(intervals(start, end, phase_window,
        lambda phase, a, b: event("moon-phase", phases[phase], a, b,
            f"The Moon is near its {phases[phase]} phase (within 9 degrees of the phase angle).")
            if phase >= 0 else None, timedelta(hours=1)))
    return {"schemaVersion": 1, "validFrom": iso(start), "validUntil": iso(end),
            "source": {"name": "pyswisseph", "version": swe.version,
                       "url": "https://github.com/astrorigin/pyswisseph",
                       "ephemeris": "Moshier (built into Swiss Ephemeris)",
                       "coordinates": "geocentric tropical ecliptic", "timeScale": "UT"},
            "events": sorted(events, key=lambda e: (e["startsAt"], e["id"]))}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--start", default=f"{datetime.now(UTC).year}-01")
    parser.add_argument("--months", type=int, default=36)
    parser.add_argument("--out", type=Path, default=ROOT / "public" / "sky")
    args = parser.parse_args()
    start = datetime.strptime(args.start, "%Y-%m").replace(tzinfo=UTC)
    if not 1 <= args.months <= 120:
        parser.error("--months must be 1–120")
    args.out.mkdir(parents=True, exist_ok=True)
    for index in range(args.months):
        date = month_after(start, index)
        data = generate_month(date)
        (args.out / f"{date:%Y-%m}.json").write_text(
            json.dumps(data, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(f"Generated {args.months} months from {start:%Y-%m} in {args.out}")


if __name__ == "__main__":
    main()
