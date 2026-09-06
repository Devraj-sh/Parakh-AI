"""
milestone1_run.py — MILESTONE 1 runner.

Usage:
    python milestone1_run.py <image_path>
    python milestone1_run.py  # uses bundled sample image

Prints raw PaddleOCR output: (bbox, text, confidence) for every detected line.
No preprocessing, no field extraction — just raw OCR output to confirm the
engine is working end-to-end.
"""
import sys
import os
from pathlib import Path

# ── Allow running from project root without installing the package ─────────
sys.path.insert(0, str(Path(__file__).parent))

from ai_label_scanner.utils.image_io import load_image, resize_for_ocr, poly_to_rect
from ai_label_scanner.ocr.ocr_engine import engine


# ──────────────────────────────────────────────────────────────────────────
# Sample image: synthetic Indian packaged product label generated locally.
# Run  tests/generate_samples.py  to regenerate if needed.
# ──────────────────────────────────────────────────────────────────────────
SAMPLE_PATH = Path(__file__).parent / "tests" / "sample_images" / "sunfeast_marie.jpg"


def fetch_sample_image():
    if not SAMPLE_PATH.exists():
        raise FileNotFoundError(
            f"Sample image not found: {SAMPLE_PATH}\n"
            "Run:  python3 tests/generate_samples.py"
        )
    return str(SAMPLE_PATH)


def run(image_path: str):
    print("=" * 70)
    print("  PARAKH AI — MILESTONE 1: Raw PaddleOCR Output")
    print("=" * 70)
    print(f"  Image : {image_path}")

    # 1. Load
    image = load_image(image_path)
    h, w = image.shape[:2]
    print(f"  Size  : {w}×{h} px")

    # 2. Resize (no enhancement yet — that's Milestone 2)
    resized, scale_factor = resize_for_ocr(image)
    rh, rw = resized.shape[:2]
    print(f"  Resized to : {rw}×{rh} px  (scale_factor={scale_factor:.3f})")
    print()

    # 3. Run OCR
    print("Running PaddleOCR …")
    results = engine.run(resized)

    # 4. Print results
    print()
    print(f"{'#':<4} {'BBOX (x1,y1,x2,y2)':<32} {'CONF':>6}  TEXT")
    print("-" * 80)
    for i, r in enumerate(results):
        x1, y1, x2, y2 = [int(v) for v in r.bbox]
        bbox_str = f"[{x1:4d},{y1:4d},{x2:4d},{y2:4d}]"
        print(f"{i:<4} {bbox_str:<32} {r.confidence:>6.3f}  {r.text!r}  [{r.lang}]")

    print()
    print(f"Total lines detected: {len(results)}")
    print()

    # 5. Quick sanity check
    if len(results) == 0:
        print("⚠️  WARNING: No text detected. Check image quality or PaddleOCR install.")
    else:
        avg_conf = sum(r.confidence for r in results) / len(results)
        print(f"Average OCR confidence : {avg_conf:.3f}")
        print()
        print("✅  MILESTONE 1 DONE — PaddleOCR is reading text from the image.")
        print("    Proceed to Milestone 2 (preprocessing + quality checks).")

    return results


if __name__ == "__main__":
    if len(sys.argv) > 1:
        img_path = sys.argv[1]
    else:
        img_path = fetch_sample_image()

    run(img_path)
