"""Daily factual windows, publication completeness, and copy checks."""
from copy import deepcopy
from datetime import datetime, timedelta
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from daily_readings import (CONJUNCTION_BODIES, ENVELOPE_KEYS, TONES, angular_separation,
                            conjunction_events, day_window, make_batch, make_plan,
                            publish, validate_batch, validate_plan, write_json_atomic)
from generate_sky import UTC, position


def complete_drafts(plan):
    return [{"eventId": item["id"], "tone": tone,
             "text": f"Case {index}: {tone} excuse number {number} has entered processing."}
            for index, item in enumerate(plan["events"])
            for tone in TONES for number in range(2)]


def complete_explanations(plan):
    return [{"eventId": item["id"],
             "text": f"Interpretation {index}: Astrologers associate this placement with familiar themes to reflect on. "
                     "This symbolic reading is a tradition, rather than an astronomical measurement or prediction."}
            for index, item in enumerate(plan["events"])]


class DailyReadingsTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.plan = make_plan("2026-10-28")

    def test_calendar_day_windows_follow_new_york_dst(self):
        cases = [("2026-03-08", 23, "2026-03-08T05:00:00+00:00", "2026-03-09T04:00:00+00:00"),
                 ("2026-11-01", 25, "2026-11-01T04:00:00+00:00", "2026-11-02T05:00:00+00:00"),
                 ("2026-10-28", 24, "2026-10-28T04:00:00+00:00", "2026-10-29T04:00:00+00:00")]
        for value, hours, expected_start, expected_end in cases:
            start, end = day_window(value)
            self.assertEqual((end - start).total_seconds(), hours * 3600)
            self.assertEqual(start.isoformat(), expected_start)
            self.assertEqual(end.isoformat(), expected_end)
        for value in [None, "20261028", "2026-1-1", "2026-10-28T00:00:00Z", "2026-02-30"]:
            with self.assertRaises(ValueError):
                day_window(value)

    def test_mutating_a_returned_plan_cannot_change_the_calculated_baseline(self):
        altered = make_plan("2026-10-28")
        altered["events"][0]["fact"] = "A fabricated astronomical fact."
        with self.assertRaises(ValueError):
            validate_plan(altered)
        self.assertNotEqual(make_plan("2026-10-28")["events"][0]["fact"], altered["events"][0]["fact"])
        altered = make_plan("2026-10-28")
        altered["source"]["name"] = "An invented ephemeris"
        with self.assertRaises(ValueError):
            validate_plan(altered)
        self.assertEqual(make_plan("2026-10-28")["source"]["name"], "pyswisseph")

    def test_plan_contains_narrow_facts_and_six_readings_per_interval(self):
        plan = self.plan
        self.assertEqual(len(plan["events"]), 16)
        self.assertEqual(plan["summary"]["expectedReadings"], 96)
        self.assertEqual(len(plan["assignments"]), len(plan["events"]))
        for assignment, item in zip(plan["assignments"], plan["events"]):
            self.assertEqual(assignment["eventId"], item["id"])
            self.assertEqual(assignment["fact"], item["fact"])
            self.assertEqual(assignment["tones"], list(TONES))
            self.assertEqual(assignment["jokesPerTone"], 2)
        base = [item for item in plan["events"] if item["kind"] != "conjunction"]
        self.assertEqual(len(base), 15)
        self.assertEqual({item["kind"] for item in base}, {"planet-sign", "moon-sign", "retrograde"})

    def test_conjunction_calculation_wraps_the_zodiac_cusp(self):
        self.assertEqual(angular_separation(359, 1), 2)
        self.assertEqual(angular_separation(1, 359), 2)
        self.assertEqual(angular_separation(0, 180), 180)
        start = datetime(2026, 1, 1, tzinfo=UTC)
        end = start + timedelta(hours=12)

        def moving_longitude(when, body):
            return (359 if body == 0 else (355 + (when - start).total_seconds() / 3600) % 360,)

        with patch("daily_readings.CONJUNCTION_BODIES", {"Sun": 0, "Moon": 1}), \
                patch("daily_readings.position", side_effect=moving_longitude):
            windows = conjunction_events(start, end)
        self.assertEqual(len(windows), 1)
        a = datetime.fromisoformat(windows[0]["startsAt"])
        b = datetime.fromisoformat(windows[0]["endsAt"])
        self.assertLessEqual(abs((a - (start + timedelta(hours=1))).total_seconds()), 1)
        self.assertLessEqual(abs((b - (start + timedelta(hours=7))).total_seconds()), 1)
        self.assertEqual(windows[0]["subject"], "Sun conjunct Moon")
        self.assertEqual(windows[0]["bodies"], ["Sun", "Moon"])

    def test_actual_conjunctions_have_truthful_bodies_orbs_and_windows(self):
        start, end = day_window(self.plan["date"])
        windows = [item for item in self.plan["events"] if item["kind"] == "conjunction"]
        self.assertEqual(len(windows), 1)
        self.assertEqual(set(windows[0]["bodies"]), {"Moon", "Uranus"})
        for window in windows:
            a = datetime.fromisoformat(window["startsAt"])
            b = datetime.fromisoformat(window["endsAt"])
            self.assertLess(a, b)
            self.assertGreaterEqual(a, start)
            self.assertLessEqual(b, end)
            mid = a + (b - a) / 2
            first, second = window["bodies"]
            separation = angular_separation(position(mid, CONJUNCTION_BODIES[first])[0],
                                            position(mid, CONJUNCTION_BODIES[second])[0])
            self.assertLessEqual(separation, 3)
            self.assertEqual(window["orbDegrees"], 3)
            self.assertEqual(window["subject"], f"{first} conjunct {second}")

    def test_month_boundary_includes_both_original_month_windows(self):
        plan = make_plan("2026-10-31")
        suns = [item for item in plan["events"] if item["kind"] == "planet-sign" and item["subject"] == "Sun"]
        self.assertEqual(len(suns), 2)
        self.assertEqual(suns[0]["endsAt"], "2026-11-01T00:00:00Z")
        self.assertEqual(suns[1]["startsAt"], "2026-11-01T00:00:00Z")
        self.assertNotEqual(suns[0]["id"], suns[1]["id"])
        self.assertEqual(suns[0]["fact"], suns[1]["fact"])
        self.assertLess(datetime.fromisoformat(suns[0]["startsAt"]), datetime.fromisoformat(plan["validFrom"]))
        self.assertGreater(datetime.fromisoformat(suns[1]["endsAt"]), datetime.fromisoformat(plan["validUntil"]))

    def test_complete_drafts_publish_a_canonical_deterministic_batch(self):
        drafts = complete_drafts(self.plan)
        with tempfile.TemporaryDirectory() as directory:
            batch = make_batch(self.plan, drafts, directory)
            again = make_batch(self.plan, list(reversed(drafts)), directory)
        self.assertEqual(set(batch), set(ENVELOPE_KEYS) | {"readings"})
        self.assertEqual(len(batch["readings"]), 96)
        self.assertEqual(len({item["id"] for item in batch["readings"]}), 96)
        self.assertEqual(batch, again)
        self.assertEqual(batch["readings"][0]["id"],
                         f"daily-2026-10-28-{self.plan['events'][0]['id']}-tech-0")

    def test_altered_sky_facts_are_rejected_before_publish(self):
        for key, replacement in [("validUntil", "2026-10-30T04:00:00Z"), ("events", [])]:
            bad = deepcopy(self.plan)
            bad[key] = replacement
            with tempfile.TemporaryDirectory() as directory, self.assertRaisesRegex(ValueError, "calculated sky"):
                make_batch(bad, complete_drafts(self.plan), directory)
        bad = deepcopy(self.plan)
        bad["events"][0]["fact"] = "The Moon is made of overdue invoices."
        with tempfile.TemporaryDirectory() as directory, self.assertRaisesRegex(ValueError, "calculated sky"):
            make_batch(bad, complete_drafts(self.plan), directory)

    def test_incomplete_or_overfull_assignments_are_rejected(self):
        drafts = complete_drafts(self.plan)
        for incomplete in [drafts[:-1], drafts + [{**drafts[0], "text": "One unrequested extra joke."}]]:
            with tempfile.TemporaryDirectory() as directory, self.assertRaisesRegex(ValueError, "exactly 2"):
                make_batch(self.plan, incomplete, directory)

    def test_bad_copy_and_malformed_drafts_are_rejected(self):
        invalid = [{"eventId": "unknown", "tone": "tech", "text": "An unknown event."},
                   {"eventId": self.plan["events"][0]["id"], "tone": "mean", "text": "A bad tone."},
                   {"eventId": self.plan["events"][0]["id"], "tone": "tech", "text": "a" * 81},
                   {"eventId": self.plan["events"][0]["id"], "tone": "tech", "text": " trailing "},
                   {"eventId": self.plan["events"][0]["id"], "tone": "tech", "text": "A line\nbreak."},
                   {"eventId": self.plan["events"][0]["id"], "tone": "tech", "text": "..."},
                   {"eventId": self.plan["events"][0]["id"], "tone": "tech", "text": 3},
                   {"eventId": self.plan["events"][0]["id"], "tone": "tech", "text": "No extra keys.", "fact": "fake"},
                   None]
        for bad in invalid:
            with self.subTest(draft=bad), tempfile.TemporaryDirectory() as directory, self.assertRaises(ValueError):
                make_batch(self.plan, [bad] + complete_drafts(self.plan)[1:], directory)
        drafts = complete_drafts(self.plan)
        drafts[0]["text"] = "a" * 80
        with tempfile.TemporaryDirectory() as directory:
            self.assertEqual(len(make_batch(self.plan, drafts, directory)["readings"][0]["text"]), 80)

    def test_duplicate_copy_is_rejected_despite_case_or_punctuation_changes(self):
        drafts = complete_drafts(self.plan)
        drafts[1]["text"] = drafts[0]["text"].upper().replace(":", " —").replace(".", "!")
        with tempfile.TemporaryDirectory() as directory, self.assertRaisesRegex(ValueError, "Duplicate"):
            make_batch(self.plan, drafts, directory)

    def test_previous_thirty_days_are_checked_but_same_day_retries_are_allowed(self):
        drafts = complete_drafts(self.plan)
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory)
            write_json_atomic(path / "2026-10-27.json", {"readings": [{"text": drafts[0]["text"]}]})
            with self.assertRaisesRegex(ValueError, "Duplicate"):
                make_batch(self.plan, drafts, path)
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory)
            write_json_atomic(path / "2026-09-27.json", {"readings": [{"text": drafts[0]["text"]}]})
            batch = make_batch(self.plan, drafts, path)
            write_json_atomic(path / "2026-10-28.json", batch)
            self.assertEqual(validate_batch(path / "2026-10-28.json"), batch)

    def test_publish_preserves_old_file_on_failed_checks_and_validates_stable_ids(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory)
            plan_path, draft_path = path / "plan.json", path / "drafts.json"
            output = path / "2026-10-28.json"
            write_json_atomic(plan_path, self.plan)
            write_json_atomic(draft_path, complete_drafts(self.plan)[:-1])
            output.write_text("old contents", encoding="utf-8")
            with self.assertRaises(ValueError):
                publish(plan_path, [draft_path], output)
            self.assertEqual(output.read_text(), "old contents")
            write_json_atomic(draft_path, complete_drafts(self.plan))
            batch = publish(plan_path, [draft_path], output)
            self.assertEqual(validate_batch(output), batch)
            batch["readings"][0]["id"] = "tampered-id"
            write_json_atomic(output, batch)
            with self.assertRaisesRegex(ValueError, "stable IDs"):
                validate_batch(output)

    def test_atomic_write_cleans_temporary_files_when_replace_fails(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "output.json"
            output.write_text("existing", encoding="utf-8")
            with patch("daily_readings.os.replace", side_effect=OSError("blocked")), self.assertRaises(OSError):
                write_json_atomic(output, {"valid": "data"})
            self.assertEqual(output.read_text(), "existing")
            self.assertEqual(list(Path(directory).iterdir()), [output])

    def test_explanations_are_complete_deterministic_and_separate_from_facts_and_jokes(self):
        drafts = complete_drafts(self.plan)
        explanations = complete_explanations(self.plan)
        with tempfile.TemporaryDirectory() as directory:
            legacy = make_batch(self.plan, drafts, directory)
            batch = make_batch(self.plan, drafts, directory, explanations)
            reordered = make_batch(self.plan, list(reversed(drafts)), directory, list(reversed(explanations)))
        self.assertEqual(batch, reordered)
        self.assertEqual(batch["explanations"], explanations)
        self.assertEqual(batch["events"], legacy["events"])
        self.assertEqual(batch["source"], legacy["source"])
        self.assertEqual(batch["readings"], legacy["readings"])
        self.assertEqual(set(batch), set(legacy) | {"explanations"})
        self.assertNotIn("explanations", legacy)
        batch["events"][0]["fact"] = "Mutated caller data."
        batch["source"]["name"] = "Mutated source."
        batch["explanations"][0]["text"] = "Mutated explanation."
        self.assertNotEqual(make_plan(self.plan["date"])["events"][0]["fact"], "Mutated caller data.")
        self.assertEqual(make_plan(self.plan["date"])["source"]["name"], "pyswisseph")
        self.assertNotEqual(explanations[0]["text"], "Mutated explanation.")

    def test_explanation_groups_reject_missing_unknown_duplicate_and_extra_event_references(self):
        explanations = complete_explanations(self.plan)
        bad_groups = [None, {}, [], explanations[:-1], explanations + [explanations[0]],
                      [{**explanations[0], "eventId": "unknown"}] + explanations[1:],
                      [{**explanations[0], "eventId": None}] + explanations[1:],
                      [{**explanations[0], "fact": "Must stay separate"}] + explanations[1:],
                      [None] + explanations[1:]]
        for group in bad_groups:
            with self.subTest(group=group), tempfile.TemporaryDirectory() as directory, self.assertRaises(ValueError):
                make_batch(self.plan, complete_drafts(self.plan), directory, group)

    def test_explanation_text_has_unicode_length_bounds_and_normalized_uniqueness(self):
        explanations = complete_explanations(self.plan)
        for text in [None, "", "a" * 79, "a" * 651, " a" * 80, "a " * 80,
                     "a" * 80 + "\n", "a" * 40 + "\t" + "b" * 40, "." * 80]:
            bad = deepcopy(explanations)
            bad[0]["text"] = text
            with self.subTest(text=text), tempfile.TemporaryDirectory() as directory, self.assertRaises(ValueError):
                make_batch(self.plan, complete_drafts(self.plan), directory, bad)
        for text in ["😀" * 79 + "a", "é" * 650]:
            valid = deepcopy(explanations)
            valid[0]["text"] = text
            with tempfile.TemporaryDirectory() as directory:
                batch = make_batch(self.plan, complete_drafts(self.plan), directory, valid)
                self.assertEqual(batch["explanations"][0]["text"], text)
        bad = deepcopy(explanations)
        bad[1]["text"] = bad[0]["text"].upper().replace(":", "—").replace(".", "!")
        with tempfile.TemporaryDirectory() as directory, self.assertRaisesRegex(ValueError, "Duplicate"):
            make_batch(self.plan, complete_drafts(self.plan), directory, bad)

    def test_published_explanations_validate_and_malformed_present_fields_do_not_become_legacy(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "2026-10-28.json"
            legacy = make_batch(self.plan, complete_drafts(self.plan), directory)
            write_json_atomic(output, legacy)
            self.assertEqual(validate_batch(output), legacy)
            batch = make_batch(self.plan, complete_drafts(self.plan), directory, complete_explanations(self.plan))
            write_json_atomic(output, batch)
            self.assertEqual(validate_batch(output), batch)
            reordered = deepcopy(batch)
            reordered["explanations"].reverse()
            write_json_atomic(output, reordered)
            with self.assertRaisesRegex(ValueError, "validated content"):
                validate_batch(output)
            for explanations in [None, {}, [], batch["explanations"][:-1]]:
                write_json_atomic(output, {**batch, "explanations": explanations})
                with self.subTest(explanations=explanations), self.assertRaises(ValueError):
                    validate_batch(output)

    def test_explanations_are_atomic_on_publish_and_optional_for_legacy_callers(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory)
            plan_path, drafts_path, explanations_path = path / "plan.json", path / "drafts.json", path / "explain.json"
            output = path / "2026-10-28.json"
            write_json_atomic(plan_path, self.plan)
            write_json_atomic(drafts_path, complete_drafts(self.plan))
            legacy = publish(plan_path, [drafts_path], output)
            original = output.read_bytes()
            write_json_atomic(explanations_path, complete_explanations(self.plan)[:-1])
            with self.assertRaises(ValueError):
                publish(plan_path, [drafts_path], output, explanations_path)
            self.assertEqual(output.read_bytes(), original)
            write_json_atomic(explanations_path, None)
            with self.assertRaises(ValueError):
                publish(plan_path, [drafts_path], output, explanations_path)
            self.assertEqual(output.read_bytes(), original)
            write_json_atomic(explanations_path, complete_explanations(self.plan))
            published = publish(plan_path, [drafts_path], output, explanations_path)
            self.assertEqual(validate_batch(output), published)
            self.assertEqual(published["events"], legacy["events"])
            self.assertEqual(published["readings"], legacy["readings"])
            self.assertEqual(len(published["explanations"]), len(self.plan["events"]))


if __name__ == "__main__":
    unittest.main()
