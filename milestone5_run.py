"""
milestone5_run.py — MILESTONE 5 runner.
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from ai_label_scanner.utils.image_io import load_image
from ai_label_scanner.preprocessing.pipeline import run_preprocessing
from ai_label_scanner.ocr.ocr_engine import engine as ocr_engine
from ai_label_scanner.extraction.field_extractor import extract_fields
from ai_label_scanner.extraction.confidence import compute_field_confidence, calculate_spatial_proximity_score
from ai_label_scanner.evidence.regions import build_evidence_regions

SAMPLE_PATH = Path(__file__).parent / "tests" / "sample_images" / "sunfeast_marie.jpg"


def run():
    print("=" * 70)
    print("  PARAKH AI — MILESTONE 5: Evidence Region Assembly")
    print("=" * 70)

    image = load_image(str(SAMPLE_PATH))
    pre = run_preprocessing(image)
    ocr_results = ocr_engine.run(pre.processed)
    raw_fields = extract_fields(ocr_results)

    for field_name in ["net_quantity", "mrp", "manufacturer", "batch_number", "date_information"]:
        field_data = raw_fields[field_name]
        anchor = field_data.get("anchor")
        if anchor:
            ocr_conf = anchor.confidence
            kw_score = field_data.get("match_score", 1.0)
            regex_valid = 1.0 if (field_data.get("value") is not None or field_data.get("text") is not None) else 0.0
            spatial_score = calculate_spatial_proximity_score(anchor.bbox, anchor.bbox)
            field_data["confidence"] = compute_field_confidence(ocr_conf, kw_score, regex_valid, spatial_score)

    evidence_regions = build_evidence_regions(raw_fields, pre.scale_factor)

    print("\n  ── Assembled Evidence Regions ─────────────────────────────────")
    print(json.dumps([er.model_dump() for er in evidence_regions], indent=2))
    print(f"\n{'='*70}")
    print("✅  MILESTONE 5 DONE — Evidence region bounding boxes assembled.")
    print("    Proceed to Milestone 6 (Full JSON contract assembly).")
    print("=" * 70)


if __name__ == "__main__":
    run()
