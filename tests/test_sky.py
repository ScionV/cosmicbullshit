"""Domain checks for event windows and their actual calculated state."""
import sys
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from generate_sky import BODIES, SIGNS, generate_month, position
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


if __name__ == "__main__":
    unittest.main()
