"""
preprocessing/quality.py — Image quality checks.
Implements blur detection (Laplacian variance) and brightness analysis.
"""
from dataclasses import dataclass

import cv2
import numpy as np

from ai_label_scanner.config import (
    BLUR_THRESHOLD,
    BRIGHTNESS_LOW_THRESHOLD,
    BRIGHTNESS_HIGH_THRESHOLD,
)


@dataclass
class QualityReport:
    blur_score: float        # Laplacian variance; higher = sharper
    brightness_mean: float   # Mean pixel value of grayscale image
    is_blurry: bool
    is_dark: bool
    is_overexposed: bool

    @property
    def needs_sharpening(self) -> bool:
        return self.is_blurry

    @property
    def needs_clahe(self) -> bool:
        return self.is_dark

    def __str__(self) -> str:
        flags = []
        if self.is_blurry:
            flags.append("BLURRY")
        if self.is_dark:
            flags.append("DARK")
        if self.is_overexposed:
            flags.append("OVEREXPOSED")
        status = ", ".join(flags) if flags else "OK"
        return (
            f"QualityReport(blur={self.blur_score:.1f}, "
            f"brightness={self.brightness_mean:.1f}, "
            f"status={status})"
        )


def check_quality(image: np.ndarray) -> QualityReport:
    """
    Analyse image quality.

    Args:
        image: BGR numpy array.

    Returns:
        QualityReport with blur score, brightness mean, and flags.
    """
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Blur: Laplacian variance
    laplacian = cv2.Laplacian(gray, cv2.CV_64F)
    blur_score = float(laplacian.var())

    # Brightness: mean of grayscale
    brightness_mean = float(gray.mean())

    return QualityReport(
        blur_score=blur_score,
        brightness_mean=brightness_mean,
        is_blurry=(blur_score < BLUR_THRESHOLD),
        is_dark=(brightness_mean < BRIGHTNESS_LOW_THRESHOLD),
        is_overexposed=(brightness_mean > BRIGHTNESS_HIGH_THRESHOLD),
    )
