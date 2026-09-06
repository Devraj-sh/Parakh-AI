"""
pipeline.py — End-to-end processing pipeline for PARAKH AI.
"""
import time
from typing import Union, Dict, Any
import numpy as np

from ai_label_scanner.utils.image_io import load_image
from ai_label_scanner.preprocessing.pipeline import run_preprocessing
from ai_label_scanner.ocr.ocr_engine import engine as ocr_engine
from ai_label_scanner.extraction.field_extractor import extract_fields
from ai_label_scanner.extraction.confidence import compute_field_confidence, calculate_spatial_proximity_score
from ai_label_scanner.evidence.regions import build_evidence_regions
from ai_label_scanner.schemas.output import (
    ScanResult,
    QuantityField,
    MRPField,
    TextField,
)
from ai_label_scanner.config import OVERALL_CONFIDENCE_FIELD_WEIGHTS


def process_image(image_input: Union[str, bytes, np.ndarray]) -> ScanResult:
    """
    Run full PARAKH AI scanning pipeline on input image.
    Returns validated ScanResult Pydantic object matching JSON contract.
    """
    start_time = time.perf_counter()

    # 1. Load image
    if not isinstance(image_input, np.ndarray):
        img = load_image(image_input)
    else:
        img = image_input

    # 2. Quality check & conditional preprocessing
    pre_result = run_preprocessing(img)

    # 3. OCR engine execution
    ocr_results = ocr_engine.run(pre_result.processed)
    processed_width = pre_result.processed.shape[1]

    # 4. Field extraction
    extracted = extract_fields(ocr_results)

    # 5. Field level confidence scoring & truncation detection
    field_confidences = {}
    field_needs_review = {}

    for f_name in ["net_quantity", "mrp", "manufacturer", "batch_number", "date_information"]:
        f_data = extracted[f_name]
        anchor = f_data.get("anchor") if isinstance(f_data, dict) else None
        needs_rev = False

        if anchor:
            ocr_conf = anchor.confidence
            kw_score = f_data.get("match_score", 1.0)
            has_val = f_data.get("value") is not None or f_data.get("text") is not None
            regex_valid = 1.0 if has_val else 0.0
            spatial_score = calculate_spatial_proximity_score(anchor.bbox, anchor.bbox)
            conf = compute_field_confidence(ocr_conf, kw_score, regex_valid, spatial_score)

            # Truncation check
            if anchor.bbox[2] >= (processed_width - 15) or anchor.bbox[2] >= (processed_width * 0.97):
                needs_rev = True
                conf = min(conf, 0.60)
        else:
            conf = 0.0

        if isinstance(f_data, dict):
            f_data["confidence"] = conf
            f_data["needs_review"] = needs_rev
        field_confidences[f_name] = conf
        field_needs_review[f_name] = needs_rev

    # Product name confidence & review
    prod_data = extracted.get("product_name")
    prod_needs_rev = False
    if isinstance(prod_data, dict):
        prod_name_str = prod_data.get("text")
        prod_conf = round(prod_data.get("confidence", 0.85), 4)
        anc = prod_data.get("anchor")
        if anc and (anc.bbox[2] >= (processed_width - 15) or anc.bbox[2] >= (processed_width * 0.97)):
            prod_needs_rev = True
            prod_conf = min(prod_conf, 0.60)
    else:
        prod_name_str = prod_data
        prod_conf = 0.85 if prod_name_str else 0.0
    field_confidences["product_name"] = prod_conf

    # 6. Evidence region assembly
    evidence_regions = build_evidence_regions(extracted, pre_result.scale_factor, processed_width)

    # 7. Overall confidence score formula
    overall_conf = 0.0
    for f_name, w in OVERALL_CONFIDENCE_FIELD_WEIGHTS.items():
        overall_conf += w * field_confidences.get(f_name, 0.0)
    overall_conf = round(min(1.0, max(0.0, overall_conf)), 4)

    elapsed_ms = (time.perf_counter() - start_time) * 1000.0

    # 8. Assemble Pydantic ScanResult
    net_qty_data = extracted["net_quantity"]
    mrp_data = extracted["mrp"]
    mfg_data = extracted["manufacturer"]
    batch_data = extracted["batch_number"]
    date_data = extracted["date_information"]

    return ScanResult(
        product_name=prod_name_str,
        category=extracted.get("category"),
        net_quantity=QuantityField(
            value=net_qty_data.get("value"),
            unit=net_qty_data.get("unit"),
            confidence=net_qty_data.get("confidence", 0.0),
        ),
        mrp=MRPField(
            value=mrp_data.get("value"),
            currency=mrp_data.get("currency", "INR"),
            confidence=mrp_data.get("confidence", 0.0),
        ),
        manufacturer=TextField(
            text=mfg_data.get("text"),
            confidence=mfg_data.get("confidence", 0.0),
            needs_review=field_needs_review.get("manufacturer", False),
        ),
        batch_number=TextField(
            text=batch_data.get("text"),
            confidence=batch_data.get("confidence", 0.0),
            needs_review=field_needs_review.get("batch_number", False),
        ),
        date_information=TextField(
            text=date_data.get("text"),
            confidence=date_data.get("confidence", 0.0),
            needs_review=field_needs_review.get("date_information", False),
        ),
        evidence_regions=evidence_regions,
        overall_confidence=overall_conf,
        processing_time_ms=round(elapsed_ms, 2),
    )
