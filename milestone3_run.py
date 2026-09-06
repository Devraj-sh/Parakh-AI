"""
milestone3_run.py — MILESTONE 3 runner.

Demonstrates text normalisation + field extraction on OCR results.
Usage:
    python3 milestone3_run.py
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from ai_label_scanner.utils.image_io import load_image
from ai_label_scanner.preprocessing.pipeline import run_preprocessing
from ai_label_scanner.ocr.ocr_engine import engine as ocr_engine
from ai_label_scanner.extraction.field_extractor import extract_fields

SAMPLE_PATH = Path(__file__).parent / "tests" / "sample_images" / "sunfeast_marie.jpg"


def run():
    print("=" * 70)
    print("  PARAKH AI — MILESTONE 3: Text Normalisation & Hybrid Field Extraction")
    print("=" * 70)

    if not SAMPLE_PATH.exists():
        import subprocess
        subprocess.run([sys.executable, "tests/generate_samples.py"], check=True)

    image = load_image(str(SAMPLE_PATH))
    pre = run_preprocessing(image)
    ocr_results = ocr_engine.run(pre.processed)

    raw_fields = extract_fields(ocr_results)

    # Format partial output (excluding full confidence / evidence mapping objects)
    partial_json = {
        "product_name": raw_fields["product_name"],
        "category": raw_fields["category"],
        "net_quantity": {
            "value": raw_fields["net_quantity"]["value"],
            "unit": raw_fields["net_quantity"]["unit"],
        },
        "mrp": {
            "value": raw_fields["mrp"]["value"],
            "currency": raw_fields["mrp"]["currency"],
        },
        "manufacturer": {
            "text": raw_fields["manufacturer"]["text"],
        },
        "batch_number": {
            "text": raw_fields["batch_number"]["text"],
        },
        "date_information": {
            "text": raw_fields["date_information"]["text"],
        },
    }

    print("\n  ── Extracted Partial JSON ─────────────────────────────────────")
    print(json.dumps(partial_json, indent=2))
    print(f"\n{'='*70}")
    print("✅  MILESTONE 3 DONE — Text normalised & fields extracted.")
    print("    Proceed to Milestone 4 (confidence scoring formula).")
    print("=" * 70)


if __name__ == "__main__":
    run()
