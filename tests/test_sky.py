"""Domain checks for event windows and their actual calculated state."""
import sys
import json
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from generate_sky import BODIES, SIGN_BODIES, SIGNS, generate_month, position, sign_ingress
import swisseph as swe


class SkyTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = generate_month(datetime(2026, 10, 1, tzinfo=timezone.utc))

    def test_mercury_retrograde_station(self):
        windows = [e for e in self.data["events"] if e["kind"] == "retrograde" and e["subject"] == "Mercury"]
        self.assertEqual(len(windows), 1)
        start = datetime.fromisoformat(windows[0]["startsAt"])
        self.assertGreaterEqual(start.day, 23)
        self.assertLessEqual(start.day, 25)
        self.assertGreater(position(start - timedelta(minutes=2), swe.MERCURY)[3], 0)
        self.assertLess(position(start + timedelta(minutes=2), swe.MERCURY)[3], 0)

    def test_moon_signs_cover_month_without_gaps(self):
        signs = sorted((e for e in self.data["events"] if e["kind"] == "moon-sign"), key=lambda e: e["startsAt"])
        self.assertEqual(signs[0]["startsAt"], self.data["validFrom"])
        self.assertEqual(signs[-1]["endsAt"], self.data["validUntil"])
        for first, second in zip(signs, signs[1:]):
            self.assertEqual(first["endsAt"], second["startsAt"])

    def test_facts_match_interval_midpoints(self):
        for event in self.data["events"]:
            a, b = datetime.fromisoformat(event["startsAt"]), datetime.fromisoformat(event["endsAt"])
            self.assertLess(a, b)
            mid = a + (b - a) / 2
            if event["kind"] == "retrograde":
                self.assertLess(position(mid, BODIES[event["subject"]])[3], 0)
            elif event["kind"] == "moon-sign":
                self.assertEqual(SIGNS[int(position(mid, swe.MOON)[0] // 30)], event["subject"])
            elif event["kind"] == "planet-sign":
                self.assertEqual(SIGNS[int(position(mid, SIGN_BODIES[event["subject"]])[0] // 30)], event["sign"])

    def test_every_calendar_has_gapless_planet_coverage_and_correct_positions(self):
        files = sorted((Path(__file__).resolve().parents[1] / "public" / "sky").glob("*.json"))
        self.assertGreaterEqual(len(files), 36)
        for path in files:
            data = json.loads(path.read_text(encoding="utf-8"))
            with self.subTest(month=path.stem):
                self.assertEqual(data["schemaVersion"], 1)
                events = data["events"]
                self.assertEqual(events, sorted(events, key=lambda e: (e["startsAt"], e["id"])))
                self.assertEqual(len(events), len({e["id"] for e in events}))
                planets = [e for e in events if e["kind"] == "planet-sign"]
                self.assertEqual({e["subject"] for e in planets}, set(SIGN_BODIES))
                for name, body in SIGN_BODIES.items():
                    windows = [e for e in planets if e["subject"] == name]
                    self.assertEqual(windows[0]["startsAt"], data["validFrom"])
                    self.assertEqual(windows[-1]["endsAt"], data["validUntil"])
                    for first, second in zip(windows, windows[1:]):
                        self.assertEqual(first["endsAt"], second["startsAt"])
                        self.assertNotEqual(first["sign"], second["sign"])
                    for window in windows:
                        a = datetime.fromisoformat(window["startsAt"])
                        b = datetime.fromisoformat(window["endsAt"])
                        self.assertLess(a, b)
                        self.assertTrue(window["startsAt"].endswith("Z"))
                        self.assertTrue(window["endsAt"].endswith("Z"))
                        self.assertEqual(SIGNS[int(position(a + (b - a) / 2, body)[0] // 30)], window["sign"])

    def test_published_2026_ingresses_and_true_dates_across_months(self):
        # Astrodienst's monthly newsletters give these dates (UTC, +/- one day).
        # https://www.astro.com/news/nl_news2601_e.htm (Neptune)
        # https://www.astro.com/news/nl_news2602_e.htm (Saturn)
        # https://www.astro.com/news/nl_news2604_e.htm (Uranus)
        # https://www.astro.com/news/nl_news2606_e.htm (Jupiter)
        cases = [("Neptune", "Aries", 1, 26), ("Saturn", "Aries", 2, 14),
                 ("Uranus", "Gemini", 4, 26), ("Jupiter", "Leo", 6, 30)]
        for body, sign, month, day in cases:
            with self.subTest(body=body):
                data = generate_month(datetime(2026, month, 1, tzinfo=timezone.utc))
                window = next(e for e in data["events"] if e["kind"] == "planet-sign"
                              and e["subject"] == body and e["sign"] == sign)
                ingress = datetime.fromisoformat(window["startsAt"])
                expected = datetime(2026, month, day, tzinfo=timezone.utc)
                self.assertLessEqual(abs((ingress.date() - expected.date()).days), 1)
                self.assertIn(f"since {ingress:%Y-%m-%d}", window["fact"])
                later = next(e for e in self.data["events"] if e["kind"] == "planet-sign"
                             and e["subject"] == body and e["sign"] == sign)
                self.assertEqual(window["fact"], later["fact"])

    def test_saturn_return_uses_most_recent_ingress(self):
        data = generate_month(datetime(2025, 9, 1, tzinfo=timezone.utc))
        saturn = [e for e in data["events"] if e["kind"] == "planet-sign" and e["subject"] == "Saturn"]
        self.assertEqual([e["sign"] for e in saturn], ["Aries", "Pisces"])
        self.assertIn("since 2025-05-25", saturn[0]["fact"])
        self.assertIn("since 2025-09-01", saturn[1]["fact"])

    def test_pluto_last_entered_aquarius_in_2024_throughout_three_year_range(self):
        directory = Path(__file__).resolve().parents[1] / "public" / "sky"
        for year in range(2026, 2029):
            for month in range(1, 13):
                path = directory / f"{year}-{month:02d}.json"
                data = json.loads(path.read_text(encoding="utf-8")) if path.exists() else generate_month(
                    datetime(year, month, 1, tzinfo=timezone.utc))
                pluto = [e for e in data["events"] if e["kind"] == "planet-sign" and e["subject"] == "Pluto"]
                self.assertEqual(len(pluto), 1)
                self.assertEqual(pluto[0]["sign"], "Aquarius")
                self.assertEqual(pluto[0]["fact"],
                    "Pluto has been in tropical Aquarius since 2024-11-19 (geocentric zodiac).")

    def test_ingress_search_does_not_skip_a_short_retrograde_excursion(self):
        start = datetime(2026, 1, 12, tzinfo=timezone.utc)
        departure = start - timedelta(days=2)
        return_date = start - timedelta(days=1)

        def short_excursion(date, body):
            return (35 if departure <= date < return_date else 25,)

        with patch("generate_sky.position", side_effect=short_excursion):
            self.assertEqual(sign_ingress(start, swe.MERCURY, 0), return_date)


if __name__ == "__main__":
    unittest.main()
