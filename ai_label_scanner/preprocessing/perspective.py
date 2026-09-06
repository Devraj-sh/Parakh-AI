"""
preprocessing/perspective.py — Conditional perspective correction.

Strategy: PaddleOCR's angle classifier (use_angle_cls=True) handles most
rotation. This module handles gross perspective warp correction using contour
detection — only applied when a dominant rectangular contour is found.
"""
import logging
from typing import Optional

import cv2
import numpy as np

logger = logging.getLogger(__name__)


def correct_perspective(image: np.ndarray) -> np.ndarray:
    """
    Attempt to detect and correct perspective distortion of a label/card.
    If no dominant quadrilateral is found, returns the original image unchanged.

    Args:
        image: BGR numpy array.

    Returns:
        Perspective-corrected BGR array, or original if correction not possible.
    """
    quad = _find_label_quad(image)
    if quad is None:
        logger.debug("No dominant quad found — skipping perspective correction.")
        return image

    return _four_point_transform(image, quad)


def _find_label_quad(image: np.ndarray) -> Optional[np.ndarray]:
    """
    Find the largest 4-sided contour that plausibly represents a label.
    Returns the 4-point array or None.
    """
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edged = cv2.Canny(blurred, 50, 150)

    contours, _ = cv2.findContours(edged, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    contours = sorted(contours, key=cv2.contourArea, reverse=True)

    h, w = image.shape[:2]
    image_area = h * w

    for cnt in contours[:5]:
        peri = cv2.arcLength(cnt, True)
        approx = cv2.approxPolyDP(cnt, 0.02 * peri, True)

        if len(approx) == 4:
            area = cv2.contourArea(approx)
            # Only accept if it covers at least 20% of the image
            if area > 0.2 * image_area:
                return approx.reshape(4, 2).astype(np.float32)

    return None


def _order_points(pts: np.ndarray) -> np.ndarray:
    """Order 4 points as: top-left, top-right, bottom-right, bottom-left."""
    rect = np.zeros((4, 2), dtype=np.float32)
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]   # top-left
    rect[2] = pts[np.argmax(s)]   # bottom-right
    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]  # top-right
    rect[3] = pts[np.argmax(diff)]  # bottom-left
    return rect


def _four_point_transform(image: np.ndarray, pts: np.ndarray) -> np.ndarray:
    """Apply a perspective transform given 4 corner points."""
    rect = _order_points(pts)
    tl, tr, br, bl = rect

    width_a = np.linalg.norm(br - bl)
    width_b = np.linalg.norm(tr - tl)
    max_w = int(max(width_a, width_b))

    height_a = np.linalg.norm(tr - br)
    height_b = np.linalg.norm(tl - bl)
    max_h = int(max(height_a, height_b))

    dst = np.array(
        [[0, 0], [max_w - 1, 0], [max_w - 1, max_h - 1], [0, max_h - 1]],
        dtype=np.float32,
    )

    M = cv2.getPerspectiveTransform(rect, dst)
    warped = cv2.warpPerspective(image, M, (max_w, max_h))
    logger.debug("Perspective correction applied → output size %dx%d", max_w, max_h)
    return warped
