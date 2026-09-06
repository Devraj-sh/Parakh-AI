"""
preprocessing/enhancement.py — Conditional image enhancement.

Rules (from architecture spec):
  • CLAHE  → only if image is dark (brightness < threshold)
  • Sharpen → only if image is blurry (Laplacian variance < threshold)
  • Never binarize / threshold before OCR
"""
import cv2
import numpy as np

from ai_label_scanner.config import (
    CLAHE_CLIP_LIMIT,
    CLAHE_TILE_GRID,
    SHARPEN_STRENGTH,
)
from ai_label_scanner.preprocessing.quality import QualityReport


def enhance(image: np.ndarray, report: QualityReport) -> np.ndarray:
    """
    Apply conditional enhancements based on quality report.

    Args:
        image:  BGR numpy array (original or resized).
        report: QualityReport from check_quality().

    Returns:
        Enhanced BGR numpy array (may be the same array if no enhancement needed).
    """
    result = image.copy()

    if report.needs_clahe:
        result = _apply_clahe(result)

    if report.needs_sharpening:
        result = _apply_sharpen(result)

    return result


def _apply_clahe(image: np.ndarray) -> np.ndarray:
    """
    Apply CLAHE (Contrast Limited Adaptive Histogram Equalisation) to the
    L-channel of the LAB colour space, leaving colour channels untouched.
    This avoids the colour-shift artefacts of equalising on BGR directly.
    """
    lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
    l_ch, a_ch, b_ch = cv2.split(lab)

    clahe = cv2.createCLAHE(clipLimit=CLAHE_CLIP_LIMIT, tileGridSize=CLAHE_TILE_GRID)
    l_eq = clahe.apply(l_ch)

    lab_eq = cv2.merge([l_eq, a_ch, b_ch])
    return cv2.cvtColor(lab_eq, cv2.COLOR_LAB2BGR)


def _apply_sharpen(image: np.ndarray) -> np.ndarray:
    """
    Unsharp mask sharpening.
    Result = original + strength * (original - gaussian_blur(original))
    """
    blur = cv2.GaussianBlur(image, (0, 0), sigmaX=3)
    sharpened = cv2.addWeighted(image, 1 + SHARPEN_STRENGTH, blur, -SHARPEN_STRENGTH, 0)
    return sharpened
