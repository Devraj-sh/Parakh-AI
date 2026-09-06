"""
ocr/ocr_engine.py — PaddleOCR v3 wrapper.
"""
from __future__ import annotations

import logging
import re
from dataclasses import dataclass
from typing import List, Optional

import numpy as np

from ai_label_scanner.config import (
    OCR_LANG_PRIMARY,
    OCR_LANG_SECONDARY,
)

logger = logging.getLogger(__name__)

# Devanagari Unicode block: U+0900–U+097F
_DEVANAGARI_RE = re.compile(r"[\u0900-\u097F]")


@dataclass
class OCRResult:
    bbox: List[float]         # [x1, y1, x2, y2] axis-aligned
    text: str
    confidence: float
    poly: List[List[float]]   # 4-point polygon [[x,y], …]
    lang: str = "en"


def _parse_paddle_result(paddle_result, lang: str) -> List[OCRResult]:
    out: List[OCRResult] = []

    texts = paddle_result.get("rec_texts", []) or []
    scores = paddle_result.get("rec_scores", []) or []
    polys = paddle_result.get("rec_polys", []) or []
    boxes = paddle_result.get("rec_boxes", None)

    for i, (text, score) in enumerate(zip(texts, scores)):
        if not text:
            continue

        if boxes is not None and i < len(boxes):
            b = boxes[i]
            bbox = [float(b[0]), float(b[1]), float(b[2]), float(b[3])]
        elif i < len(polys):
            poly_arr = np.asarray(polys[i])
            xs, ys = poly_arr[:, 0], poly_arr[:, 1]
            bbox = [float(xs.min()), float(ys.min()), float(xs.max()), float(ys.max())]
        else:
            bbox = [0.0, 0.0, 0.0, 0.0]

        if i < len(polys):
            poly = np.asarray(polys[i]).tolist()
        else:
            x1, y1, x2, y2 = bbox
            poly = [[x1, y1], [x2, y1], [x2, y2], [x1, y2]]

        out.append(
            OCRResult(
                bbox=bbox,
                text=str(text),
                confidence=float(score),
                poly=poly,
                lang=lang,
            )
        )

    return out


def _has_devanagari(results: List[OCRResult]) -> bool:
    return any(_DEVANAGARI_RE.search(r.text) for r in results)


def _iou(b1: List[float], b2: List[float]) -> float:
    ix1 = max(b1[0], b2[0])
    iy1 = max(b1[1], b2[1])
    ix2 = min(b1[2], b2[2])
    iy2 = min(b1[3], b2[3])
    if ix2 <= ix1 or iy2 <= iy1:
        return 0.0
    inter = (ix2 - ix1) * (iy2 - iy1)
    a1 = max((b1[2] - b1[0]) * (b1[3] - b1[1]), 1e-6)
    a2 = max((b2[2] - b2[0]) * (b2[3] - b2[1]), 1e-6)
    return inter / (a1 + a2 - inter)


def _merge_results(
    primary: List[OCRResult],
    secondary: List[OCRResult],
    iou_threshold: float = 0.3,
) -> List[OCRResult]:
    merged = list(primary)
    for hi in secondary:
        overlapping = [
            (i, r) for i, r in enumerate(merged) if _iou(hi.bbox, r.bbox) > iou_threshold
        ]
        if not overlapping:
            merged.append(hi)
        else:
            idx, en_r = max(overlapping, key=lambda x: _iou(hi.bbox, x[1].bbox))
            if hi.confidence > en_r.confidence:
                merged[idx] = hi
    return merged


class OCREngine:
    """
    Singleton PaddleOCR v3 engine wrapper with eager warm-up support.
    """

    def __init__(self):
        self._ocr_en = None
        self._ocr_hi = None

    def _get_ocr(self, lang: str):
        from paddleocr import PaddleOCR  # type: ignore

        if lang == OCR_LANG_PRIMARY:
            if self._ocr_en is None:
                logger.info("Initialising PaddleOCR v3 [lang=%s] …", lang)
                self._ocr_en = PaddleOCR(
                    lang=lang,
                    use_textline_orientation=True,
                )
            return self._ocr_en

        if lang == OCR_LANG_SECONDARY:
            if self._ocr_hi is None:
                logger.info("Initialising PaddleOCR v3 [lang=%s] …", lang)
                self._ocr_hi = PaddleOCR(
                    lang=lang,
                    use_textline_orientation=True,
                )
            return self._ocr_hi

        raise ValueError(f"Unsupported OCR language: {lang}")

    def warmup(self):
        """
        Eagerly load models and perform a dummy prediction pass so first request is fast.
        """
        logger.info("Warming up OCREngine singleton...")
        ocr = self._get_ocr(OCR_LANG_PRIMARY)
        dummy_img = np.zeros((100, 100, 3), dtype=np.uint8)
        ocr.predict(dummy_img)
        logger.info("OCREngine warmup complete.")

    def run(self, image: np.ndarray) -> List[OCRResult]:
        ocr_en = self._get_ocr(OCR_LANG_PRIMARY)
        raw_list = ocr_en.predict(image)

        results: List[OCRResult] = []
        for page_result in raw_list:
            results.extend(_parse_paddle_result(page_result, lang=OCR_LANG_PRIMARY))

        if _has_devanagari(results):
            logger.info("Devanagari detected — running Hindi OCR pass …")
            ocr_hi = self._get_ocr(OCR_LANG_SECONDARY)
            raw_hi = ocr_hi.predict(image)
            hi_results: List[OCRResult] = []
            for page_result in raw_hi:
                hi_results.extend(_parse_paddle_result(page_result, lang=OCR_LANG_SECONDARY))
            results = _merge_results(results, hi_results)

        results.sort(key=lambda r: (r.bbox[1], r.bbox[0]))
        return results


# Global singleton instance
engine = OCREngine()
