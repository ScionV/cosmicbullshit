"""Export the approved clips without upscaling, and derive the still from video.

Requires ffmpeg on PATH (or --ffmpeg). Originals are retained locally; their
generation job IDs and prompts are in assets/animation-provenance.json.
"""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
CLIPS = {
    "idle": "v1/idle.mp4",
    "idle-sleeve": "v2/idle-sleeve.mp4",
    "idle-sleepy": "v2/idle-sleepy.mp4",
    "idle-tie": "v3/idle-tie.mp4",
    "idle-yawn": "v3/idle-yawn.mp4",
    "idle-fist-stretch": "v4/reading-knuckles.mp4",
    "idle-fist-warmup": "v4/reading-knuckles-v2.mp4",
    "idle-eye-roll": "v6/idle-eye-roll.mp4",
    "idle-brief-wave": "v6/idle-brief-wave.mp4",
    "idle-dust-shoulders": "v6/idle-dust-shoulders.mp4",
    "reading": "v2/reading-v2.mp4",
    "reading-hands": "v3/reading-hands.mp4",
    "reading-slow-circle": "v5/reading-slow-circle.mp4",
    "reading-two-hand-hover": "v5/reading-two-hand-hover.mp4",
    "reading-adjust-glasses": "v5/reading-adjust-glasses.mp4",
    "dispensing": "v1/dispensing.mp4",
    "dispensing-headshake": "v4/dispensing-headshake.mp4",
    "dispensing-shrug": "v4/dispensing-shrug.mp4",
}
FILTER = "crop=396:376:216:254"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ffmpeg", default="ffmpeg")
    parser.add_argument("--source-dir", type=Path, default=ROOT / ".impeccable/animations")
    args = parser.parse_args()
    output = ROOT / "public/media/v2"
    output.mkdir(parents=True, exist_ok=True)
    records = []
    for name, relative in CLIPS.items():
        source = args.source_dir / relative
        subprocess.run([
            args.ffmpeg, "-y", "-loglevel", "error", "-i", str(source),
            "-vf", FILTER, "-an", "-c:v", "libx264", "-crf", "17",
            "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
            str(output / f"{name}.mp4"),
        ], check=True)
        records.append({"name": name, "source": relative,
                        "sourceSha256": hashlib.sha256(source.read_bytes()).hexdigest()})
    # Decode the delivered MP4, so the still matches the actual first video frame,
    # including its crop, color conversion, and compression. WebP stays lossless.
    subprocess.run([
        args.ffmpeg, "-y", "-loglevel", "error", "-i", str(output / "idle.mp4"),
        "-frames:v", "1", "-c:v", "libwebp", "-lossless", "1", "-pix_fmt", "bgra",
        str(output / "resting-window.webp"),
    ], check=True)
    metadata = {
        "prompt": "Deterministic derivative of the approved Kling animation; no new generation. "
                  "Resting image is the first decoded frame of the delivered idle.mp4, encoded as lossless WebP.",
        "generationProvenance": "assets/animation-provenance.json",
        "filter": FILTER, "encoding": "H.264 CRF 17, slow, yuv420p; no scaling; silent",
        "width": 396, "height": 376, "clips": records,
    }
    (output / "resting-window.webp.json").write_text(
        json.dumps(metadata, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
