"""
extraction/confidence.py — Weighted confidence scoring formula implementation.

Formula:
  field_confidence = 0.4*ocr_confidence + 0.3*keyword_match_score + 0.2*regex_validity + 0.1*spatial_proximity_score

Where:
  • ocr_confidence: confidence returned by PaddleOCR (0.0 to 1.0)
  • keyword_match_score: 1.0 exact match, 0.5 fuzzy/partial match, 0.0 none
  • regex_validity: 1.0 clean regex match else 0.0
  • spatial_proximity_score: normalized inverse distance between value bbox and keyword bbox centers
"""
import math
from typing import List, Optional, Tuple
from ai_label_scanner.config import CONFIDENCE_WEIGHTS, SPATIAL_MAX_DISTANCE_PX


def _center(bbox: List[float]) -> Tuple[float, float]:
    return (bbox[0] + bbox[2]) / 2.0, (bbox[1] + bbox[3]) / 2.0


def calculate_spatial_proximity_score(
    value_bbox: Optional[List[float]],
    keyword_bbox: Optional[List[float]],
    max_dist: float = SPATIAL_MAX_DISTANCE_PX,
) -> float:
    """
    Normalized inverse distance between value bbox and keyword bbox centers.
    Returns 1.0 if identical/same line, decaying linearly to 0.0 at max_dist.
    """
    if not value_bbox or not keyword_bbox:
        return 0.5  # Neutral default if same-line inline match without separate bboxes

    c_val = _center(value_bbox)
    c_kw = _center(keyword_bbox)
    dist = math.hypot(c_val[0] - c_kw[0], c_val[1] - c_kw[1])

    if dist >= max_dist:
        return 0.0
    return max(0.0, 1.0 - (dist / max_dist))


def compute_field_confidence(
    ocr_confidence: float,
    keyword_match_score: float,
    regex_validity: float,
    spatial_proximity_score: float,
) -> float:
    """
    Compute exact weighted field confidence.
    """
    w = CONFIDENCE_WEIGHTS
    score = (
        w["ocr_confidence"] * ocr_confidence
        + w["keyword_match_score"] * keyword_match_score
        + w["regex_validity"] * regex_validity
        + w["spatial_proximity_score"] * spatial_proximity_score
    )
    return round(min(1.0, max(0.0, score)), 4)
