"""
milestone2_run.py — MILESTONE 2 runner.

Demonstrates the full preprocessing pipeline wired before OCR.
Runs against three images to show conditional logic:
  1. sunfeast_marie.jpg  — normal (no enhancements needed)
  2. dark_label.jpg      — dark   (CLAHE fires)
  3. blurry_label.jpg    — blurry (unsharp mask fires)

For each image prints:
  • QualityReport (blur score, brightness, flags)
  • Which preprocessing steps were applied
  • Raw OCR output (bbox, text, confidence)

Usage:
    python3 milestone2_run.py
    python3 milestone2_run.py <image_path>
"""
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from ai_label_scanner.utils.image_io import load_image
from ai_label_scanner.preprocessing.pipeline import run_preprocessing
from ai_label_scanner.ocr.ocr_engine import engine as ocr_engine

SAMPLE_DIR = Path(__file__).parent / "tests" / "sample_images"

TEST_IMAGES = [
    ("normal",  SAMPLE_DIR / "sunfeast_marie.jpg"),
    ("dark",    SAMPLE_DIR / "dark_label.jpg"),
    ("blurry",  SAMPLE_DIR / "blurry_label.jpg"),
]


def run_single(label: str, image_path: Path) -> None:
    print(f"\n{'='*70}")
    print(f"  [{label.upper()}]  {image_path.name}")
    print(f"{'='*70}")

    if not image_path.exists():
        print(f"  ⚠ Image not found — run: python3 tests/generate_samples.py")
        return

    t0 = time.perf_counter()

    # 1. Load
    image = load_image(str(image_path))
    h, w = image.shape[:2]
    print(f"  Original size : {w}×{h} px")

    # 2. Preprocess
    pre = run_preprocessing(image)
    q = pre.quality
    ph, pw = pre.processed.shape[:2]

    print(f"\n  ── Quality Report ─────────────────────────────────────────────")
    print(f"     Blur score (Laplacian variance) : {q.blur_score:>8.1f}  "
          f"({'BLURRY ⚠' if q.is_blurry else 'OK ✓'})")
    print(f"     Brightness mean                 : {q.brightness_mean:>8.1f}  "
          f"({'DARK ⚠' if q.is_dark else ('OVEREXP ⚠' if q.is_overexposed else 'OK ✓')})")
    print(f"\n  ── Preprocessing Steps Applied ────────────────────────────────")
    for step in pre.steps_applied:
        print(f"     • {step}")
    print(f"     Processed image size : {pw}×{ph} px  "
          f"(scale_factor={pre.scale_factor:.3f})")

    # 3. OCR on the processed image
    print(f"\n  ── PaddleOCR Output ───────────────────────────────────────────")
    ocr_results = ocr_engine.run(pre.processed)

    if not ocr_results:
        print("  ⚠  No text detected!")
    else:
        print(f"  {'#':<4} {'BBOX':^30} {'CONF':>6}  TEXT")
        print(f"  {'-'*68}")
        for i, r in enumerate(ocr_results):
            x1, y1, x2, y2 = [int(v) for v in r.bbox]
            bbox_str = f"[{x1:4d},{y1:4d},{x2:4d},{y2:4d}]"
            print(f"  {i:<4} {bbox_str:<30} {r.confidence:>6.3f}  {r.text!r}")

    elapsed = (time.perf_counter() - t0) * 1000
    n = len(ocr_results)
    avg_conf = (sum(r.confidence for r in ocr_results) / n) if n else 0.0
    print(f"\n  Lines: {n}  |  Avg conf: {avg_conf:.3f}  |  Time: {elapsed:.0f} ms")


def main():
    print("=" * 70)
    print("  PARAKH AI — MILESTONE 2: Preprocessing + Quality Checks")
    print("=" * 70)

    # Generate sample images if missing
    missing = [p for _, p in TEST_IMAGES if not p.exists()]
    if missing:
        print("\nGenerating missing sample images …")
        import subprocess, sys as _sys
        subprocess.run([_sys.executable, "tests/generate_samples.py"], check=True)

    if len(sys.argv) > 1:
        # Single image mode
        run_single("custom", Path(sys.argv[1]))
    else:
        for label, path in TEST_IMAGES:
            run_single(label, path)

    print(f"\n{'='*70}")
    print("✅  MILESTONE 2 DONE — Preprocessing wired before OCR.")
    print("    Normal: no enhancements. Dark: CLAHE fires. Blurry: sharpen fires.")
    print("    Proceed to Milestone 3 (text normalisation + field extraction).")
    print("=" * 70)


if __name__ == "__main__":
    main()
