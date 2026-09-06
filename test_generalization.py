"""
test_generalization.py — Run full pipeline on 4 new diverse product label images and report JSON output.
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from ai_label_scanner.pipeline import process_image

SAMPLE_DIR = Path(__file__).parent / "tests" / "sample_images"

TEST_FILES = [
    ("1. Chips Packet (Lays)", SAMPLE_DIR / "lays_chips.jpg"),
    ("2. Cookie Pack with Inverted Layout (Britannia)", SAMPLE_DIR / "britannia_cookies.jpg"),
    ("3. Milk Pouch (Amul Taaza)", SAMPLE_DIR / "amul_hindi.jpg"),
    ("4. Instant Noodles (Maggi)", SAMPLE_DIR / "maggi_noodles.jpg"),
]


def test_all():
    print("=" * 70)
    print("  PARAKH AI — GENERALIZATION TEST Across 4 Diverse Products")
    print("=" * 70)

    for label, path in TEST_FILES:
        print(f"\n{'='*70}")
        print(f"  {label}  ({path.name})")
        print(f"{'='*70}")

        result = process_image(str(path))
        data = result.model_dump()

        # Print clean concise json for manual inspection
        summary = {
            "product_name": data["product_name"],
            "category": data["category"],
            "net_quantity": data["net_quantity"],
            "mrp": data["mrp"],
            "manufacturer": data["manufacturer"],
            "batch_number": data["batch_number"],
            "date_information": data["date_information"],
            "overall_confidence": data["overall_confidence"],
            "processing_time_ms": data["processing_time_ms"],
        }

        print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    test_all()
