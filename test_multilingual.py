"""
test_multilingual.py — Verification of Hindi / Devanagari bilingual label extraction.

Generates a bilingual packaged label (English + Hindi text) and tests:
  1. Devanagari detection heuristic triggering 2nd Hindi pass in OCREngine
  2. Raw OCR lines printed with (bbox, text, confidence, lang)
  3. Verification that Hindi text runs cleanly alongside English without breaking extraction
"""
import json
import sys
from pathlib import Path
import cv2
import numpy as np

sys.path.insert(0, str(Path(__file__).parent))

from ai_label_scanner.utils.image_io import load_image
from ai_label_scanner.preprocessing.pipeline import run_preprocessing
from ai_label_scanner.ocr.ocr_engine import engine as ocr_engine
from ai_label_scanner.pipeline import process_image

OUT_PATH = Path(__file__).parent / "tests" / "sample_images" / "dabur_honey_bilingual.jpg"
FONT = cv2.FONT_HERSHEY_SIMPLEX


def generate_bilingual_image() -> str:
    """
    Generate Dabur Honey product label with bilingual English + Hindi text.
    """
    W, H = 640, 800
    img = np.ones((H, W, 3), dtype=np.uint8) * 245
    # Amber gold header
    img[0:140, :] = (30, 160, 230)

    cv2.putText(img, "DABUR 100% PURE HONEY", (30, 75), FONT, 1.0, (10, 10, 120), 3, cv2.LINE_AA)
    # Hindi product subtitle rendered in Unicode or clean label text
    fields = [
        (170, "Net Wt.: 500g"),
        (220, "MRP: Rs. 220 (Incl. of all taxes)"),
        (270, "Mfg. Date: Feb 2025"),
        (320, "Exp. Date: Jan 2027"),
        (370, "Batch No: DH50022"),
        (430, "Manufactured by: Dabur India Limited,"),
        (470, "8/3, Asaf Ali Road, New Delhi - 110002"),
        (530, "शुद्ध शहद - १००% प्राकृतिक"),  # Pure Honey - 100% Natural in Hindi (Devanagari)
        (580, "डाबर इंडिया लिमिटेड द्वारा निर्मित"),  # Manufactured by Dabur India Limited in Hindi
        (640, "Customer Care: 1800-103-1600"),
        (700, "FSSAI Lic. No.: 10012011000142"),
    ]

    # Use Pillow to render Devanagari Hindi text cleanly onto OpenCV BGR image
    from PIL import Image, ImageDraw, ImageFont
    pil_img = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    draw = ImageDraw.Draw(pil_img)

    try:
        # Try standard macOS / system Devanagari font
        dev_font = ImageFont.truetype("/System/Library/Fonts/KohinoorDevanagari.ttc", 26)
    except Exception:
        try:
            dev_font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 24)
        except Exception:
            dev_font = ImageFont.load_default()

    eng_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 22)

    for y, text in fields:
        # If line contains Devanagari Unicode
        if any(ord(c) >= 0x0900 and ord(c) <= 0x097F for c in text):
            draw.text((30, y - 20), text, font=dev_font, fill=(20, 20, 20))
        else:
            draw.text((30, y - 20), text, font=eng_font, fill=(10, 10, 10))

    img_bgr = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
    cv2.imwrite(str(OUT_PATH), img_bgr)
    print(f"Generated bilingual sample: {OUT_PATH}")
    return str(OUT_PATH)


def test_bilingual():
    img_path = generate_bilingual_image()

    print("=" * 70)
    print("  PARAKH AI — HINDI / MULTILINGUAL VERIFICATION TEST")
    print("=" * 70)

    image = load_image(img_path)
    pre = run_preprocessing(image)

    # 1. Raw OCR output breakdown
    print("\n  ── Raw OCR Output Lines (Bounding Box, Text, Confidence, Lang) ──")
    ocr_results = ocr_engine.run(pre.processed)

    print(f"  {'#':<3} {'BBOX':<28} {'CONF':>6}  {'LANG':<5} TEXT")
    print("  " + "-" * 75)
    for i, r in enumerate(ocr_results):
        x1, y1, x2, y2 = [int(v) for v in r.bbox]
        bbox_str = f"[{x1:3d},{y1:3d},{x2:3d},{y2:3d}]"
        print(f"  {i:<3} {bbox_str:<28} {r.confidence:>6.3f}  [{r.lang:<2}]  {r.text!r}")

    # 2. Full pipeline JSON response
    print("\n  ── Extracted ScanResult JSON Payload ─────────────────────────")
    res = process_image(img_path)
    summary = {
        "product_name": res.product_name,
        "category": res.category,
        "net_quantity": res.net_quantity.model_dump(),
        "mrp": res.mrp.model_dump(),
        "manufacturer": res.manufacturer.model_dump(),
        "batch_number": res.batch_number.model_dump(),
        "date_information": res.date_information.model_dump(),
        "overall_confidence": res.overall_confidence,
    }
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    test_bilingual()
