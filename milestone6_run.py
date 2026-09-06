"""
milestone6_run.py — MILESTONE 6 runner.

Assembles and validates full JSON contract against Pydantic ScanResult model.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from ai_label_scanner.pipeline import process_image

SAMPLE_PATH = Path(__file__).parent / "tests" / "sample_images" / "sunfeast_marie.jpg"


def run():
    print("=" * 70)
    print("  PARAKH AI — MILESTONE 6: Full JSON Contract Assembly & Validation")
    print("=" * 70)

    result = process_image(str(SAMPLE_PATH))

    # Print formatted output JSON matching exact spec contract
    json_output = result.model_dump_json(indent=2)
    print("\n  ── Validated Final JSON Output ────────────────────────────────")
    print(json_output)

    print(f"\n{'='*70}")
    print("✅  MILESTONE 6 DONE — Full JSON contract assembled and validated.")
    print("    Proceed to Milestone 7 (FastAPI endpoint integration).")
    print("=" * 70)


if __name__ == "__main__":
    run()
