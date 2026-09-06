"""
evidence/regions.py — Evidence region assembly logic with truncation detection heuristic.
"""
from typing import Dict, List
from ai_label_scanner.schemas.output import EvidenceRegion
from ai_label_scanner.utils.image_io import remap_bbox_to_original


def build_evidence_regions(
    extracted_fields: Dict,
    scale_factor: float,
    image_width: int,
) -> List[EvidenceRegion]:
    """
    Assemble evidence regions for extracted fields, remap coordinates back to the original image,
    and detect text truncation near image boundaries.
    """
    evidence_list: List[EvidenceRegion] = []

    field_keys = [
        "product_name",
        "net_quantity",
        "mrp",
        "manufacturer",
        "batch_number",
        "date_information",
    ]

    for key in field_keys:
        f_data = extracted_fields.get(key)
        if not f_data:
            continue

        anchor = f_data.get("anchor") if isinstance(f_data, dict) else None
        conf = f_data.get("confidence", 0.0) if isinstance(f_data, dict) else 0.85

        needs_review = False

        if anchor:
            text = anchor.text
            bbox_resized = anchor.bbox
            bbox_orig = remap_bbox_to_original(bbox_resized, scale_factor)

            # Truncation heuristic: right edge within 15px of boundary or >97% of width
            right_edge = bbox_resized[2]
            if right_edge >= (image_width - 15) or right_edge >= (image_width * 0.97):
                needs_review = True
                conf = min(conf, 0.60)
        else:
            text_val = f_data.get("text") if isinstance(f_data, dict) else str(f_data)
            if not text_val:
                continue
            text = text_val
            bbox_orig = [0, 0, 0, 0]

        evidence_list.append(
            EvidenceRegion(
                field=key,
                text=text,
                bbox=bbox_orig,
                confidence=round(conf, 4),
                needs_review=needs_review,
            )
        )

    return evidence_list
