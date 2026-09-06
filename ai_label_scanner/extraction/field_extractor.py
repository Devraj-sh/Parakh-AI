"""
extraction/field_extractor.py — Hybrid field extraction logic.
"""
import math
from typing import Dict, List, Optional, Tuple

from ai_label_scanner.config import KEYWORDS, REGEX_PATTERNS
from ai_label_scanner.extraction.normalizer import (
    normalize_text,
    parse_mrp,
    parse_net_quantity,
    clean_keyword_prefix,
    parse_date_value,
    strip_trailing_punctuation,
)
from ai_label_scanner.ocr.ocr_engine import OCRResult


def _center(bbox: List[float]) -> Tuple[float, float]:
    return (bbox[0] + bbox[2]) / 2.0, (bbox[1] + bbox[3]) / 2.0


def _distance(c1: Tuple[float, float], c2: Tuple[float, float]) -> float:
    return math.hypot(c1[0] - c2[0], c1[1] - c2[1])


def _bbox_height(bbox: List[float]) -> float:
    return abs(bbox[3] - bbox[1])


def find_keyword_anchor(ocr_results: List[OCRResult], field_name: str) -> List[Tuple[OCRResult, float, str]]:
    kws = KEYWORDS.get(field_name, [])
    matches = []
    for res in ocr_results:
        norm = normalize_text(res.text).lower()
        for kw in kws:
            kw_lower = kw.lower()
            if kw_lower in norm:
                score = 1.0 if norm.startswith(kw_lower) else 0.8
                matches.append((res, score, kw))
                break
    return matches


def extract_fields(ocr_results: List[OCRResult]) -> Dict:
    extracted = {
        "product_name": None,
        "category": None,
        "net_quantity": {"value": None, "unit": None, "raw_text": None, "anchor": None, "match_score": 0.0},
        "mrp": {"value": None, "currency": "INR", "raw_text": None, "anchor": None, "match_score": 0.0},
        "manufacturer": {"text": None, "raw_text": None, "anchor": None, "match_score": 0.0},
        "batch_number": {"text": None, "raw_text": None, "anchor": None, "match_score": 0.0},
        "date_information": {"text": None, "raw_text": None, "anchor": None, "match_score": 0.0},
    }

    if not ocr_results:
        return extracted

    # 1. Net Quantity
    net_anchors = find_keyword_anchor(ocr_results, "net_quantity")
    for res, kw_score, kw in net_anchors:
        val, unit = parse_net_quantity(res.text)
        if val is not None:
            extracted["net_quantity"] = {
                "value": val,
                "unit": unit,
                "raw_text": res.text,
                "anchor": res,
                "match_score": kw_score,
            }
            break

    # 2. MRP
    mrp_anchors = find_keyword_anchor(ocr_results, "mrp")
    for res, kw_score, kw in mrp_anchors:
        val = parse_mrp(res.text)
        if val is not None:
            extracted["mrp"] = {
                "value": val,
                "currency": "INR",
                "raw_text": res.text,
                "anchor": res,
                "match_score": kw_score,
            }
            break

    # 3. Batch Number
    batch_anchors = find_keyword_anchor(ocr_results, "batch_number")
    if batch_anchors:
        res, kw_score, kw = batch_anchors[0]
        cleaned = clean_keyword_prefix(res.text, KEYWORDS["batch_number"])
        extracted["batch_number"] = {
            "text": cleaned,
            "raw_text": res.text,
            "anchor": res,
            "match_score": kw_score,
        }

    # 4. Date Information
    date_anchors = find_keyword_anchor(ocr_results, "date_information")
    if date_anchors:
        res, kw_score, kw = date_anchors[0]
        extracted_date = parse_date_value(res.text, KEYWORDS["date_information"])
        extracted["date_information"] = {
            "text": extracted_date,
            "raw_text": res.text,
            "anchor": res,
            "match_score": kw_score,
        }

    # 5. Manufacturer
    mfg_anchors = find_keyword_anchor(ocr_results, "manufacturer")
    if mfg_anchors:
        res, kw_score, kw = mfg_anchors[0]
        cleaned = clean_keyword_prefix(res.text, KEYWORDS["manufacturer"])
        extracted["manufacturer"] = {
            "text": cleaned,
            "raw_text": res.text,
            "anchor": res,
            "match_score": kw_score,
        }

    # 6. Product Name (Heuristic: largest font height / topmost non-keyword block)
    all_anchored_objs = set()
    for f in ["net_quantity", "mrp", "batch_number", "date_information", "manufacturer"]:
        anc = extracted[f].get("anchor")
        if anc:
            all_anchored_objs.add(id(anc))

    candidates = []
    for res in ocr_results:
        if id(res) in all_anchored_objs:
            continue
        norm = res.text.lower()
        if any(kw in norm for kws in KEYWORDS.values() for kw in kws if kw):
            continue
        if "customer care" in norm or "www." in norm or "fssai" in norm:
            continue
        candidates.append(res)

    if candidates:
        # Sort by height descending, then top y ascending
        candidates.sort(key=lambda r: (-_bbox_height(r.bbox), r.bbox[1]))
        top_y = candidates[0].bbox[1]
        combo = [candidates[0].text]
        # Include subtitle lines directly below (within 65px vertical offset)
        for c in candidates[1:]:
            if 0 <= (c.bbox[1] - top_y) < 65 and _bbox_height(c.bbox) > 0.5 * _bbox_height(candidates[0].bbox):
                combo.append(c.text)
        prod_name = strip_trailing_punctuation(" ".join(combo))

        # Category Lookup Rules
        p_lower = prod_name.lower()
        cat = None
        if any(w in p_lower for w in ["biscuits", "biscuit", "marie", "cookies", "wafers"]):
            cat = "Biscuits & Bakery"
        elif any(w in p_lower for w in ["chips", "crisps", "namkeen", "bhujia", "potato"]):
            cat = "Snacks & Munchies"
        elif any(w in p_lower for w in ["noodle", "noodles", "pasta", "soup", "ramen"]):
            cat = "Instant Food & Noodles"
        elif any(w in p_lower for w in ["milk", "curd", "paneer", "butter", "cheese", "taaza"]):
            cat = "Dairy Products"

        extracted["product_name"] = {
            "text": prod_name,
            "anchor": candidates[0],
            "confidence": candidates[0].confidence,
        }
        extracted["category"] = cat

    return extracted
