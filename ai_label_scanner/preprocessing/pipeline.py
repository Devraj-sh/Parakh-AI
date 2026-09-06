"""
preprocessing/pipeline.py — Full preprocessing pipeline.

Orchestrates the three conditional steps in order:
  1. perspective.correct_perspective()   (if dominant quad found)
  2. quality.check_quality()             (always — produces QualityReport)
  3. enhancement.enhance()               (conditional on QualityReport flags)

Returns:
  PreprocessResult — original image, processed image, quality report,
                     scale_factor for coordinate remapping, and a log of
                     which enhancements were applied.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import List

import numpy as np

from ai_label_scanner.preprocessing.quality import check_quality, QualityReport
from ai_label_scanner.preprocessing.enhancement import enhance
from ai_label_scanner.preprocessing.perspective import correct_perspective
from ai_label_scanner.utils.image_io import resize_for_ocr

logger = logging.getLogger(__name__)


@dataclass
class PreprocessResult:
    original: np.ndarray          # Original loaded image (BGR)
    processed: np.ndarray         # Enhancement-ready image (BGR, resized)
    quality: QualityReport        # Blur/brightness analysis on the resized image
    scale_factor: float           # original_dim / resized_dim (multiply bbox to get original coords)
    steps_applied: List[str] = field(default_factory=list)  # Human-readable log


def run_preprocessing(image: np.ndarray) -> PreprocessResult:
    """
    Run the full conditional preprocessing pipeline on a loaded BGR image.

    Args:
        image: Raw BGR image as loaded from disk / bytes.

    Returns:
        PreprocessResult with the processed image and metadata.
    """
    steps: List[str] = []

    # ── Step 1: Resize to keep longest edge ≤ MAX_IMAGE_DIMENSION ───────────
    resized, scale_factor = resize_for_ocr(image)
    if scale_factor != 1.0:
        steps.append(f"resize(scale_factor={scale_factor:.3f})")

    # ── Step 2: Perspective correction (only if dominant quad found) ─────────
    corrected = correct_perspective(resized)
    if corrected is not resized:          # correct_perspective returns same obj if skipped
        steps.append("perspective_correction")
        resized = corrected

    # ── Step 3: Quality analysis on the (possibly corrected) resized image ───
    quality = check_quality(resized)
    logger.info(str(quality))

    # ── Step 4: Conditional enhancements ─────────────────────────────────────
    processed = enhance(resized, quality)

    if quality.needs_clahe:
        steps.append("CLAHE(L-channel)")
    if quality.needs_sharpening:
        steps.append("unsharp_mask")

    if not steps:
        steps.append("none_required")

    logger.info("Preprocessing steps applied: %s", " → ".join(steps))

    return PreprocessResult(
        original=image,
        processed=processed,
        quality=quality,
        scale_factor=scale_factor,
        steps_applied=steps,
    )
