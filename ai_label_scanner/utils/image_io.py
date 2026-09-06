"""
utils/image_io.py — Image loading, resizing, and coordinate remapping helpers.
"""
from pathlib import Path
from typing import Tuple, List

import cv2
import numpy as np

from ai_label_scanner.config import MAX_IMAGE_DIMENSION


def load_image(source) -> np.ndarray:
    """
    Load an image from a file path (str/Path) or raw bytes.
    Returns a BGR numpy array as read by OpenCV.
    """
    if isinstance(source, (str, Path)):
        img = cv2.imread(str(source))
        if img is None:
            raise ValueError(f"Could not read image from path: {source}")
        return img

    if isinstance(source, (bytes, bytearray)):
        arr = np.frombuffer(source, dtype=np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Could not decode image from bytes.")
        return img

    raise TypeError(f"Unsupported image source type: {type(source)}")


def resize_for_ocr(image: np.ndarray) -> Tuple[np.ndarray, float]:
    """
    Resize the image so its longest dimension ≤ MAX_IMAGE_DIMENSION.
    Returns (resized_image, scale_factor) where scale_factor = original / resized.
    A scale_factor > 1 means the original was larger (i.e., coordinates must be
    multiplied by scale_factor to map back to the original).
    """
    h, w = image.shape[:2]
    longest = max(h, w)
    if longest <= MAX_IMAGE_DIMENSION:
        return image, 1.0

    scale = MAX_IMAGE_DIMENSION / longest
    new_w = int(w * scale)
    new_h = int(h * scale)
    resized = cv2.resize(image, (new_w, new_h), interpolation=cv2.INTER_AREA)
    return resized, 1.0 / scale  # caller multiplies by this to get original coords


def remap_bbox_to_original(
    bbox: List[float], scale_factor: float
) -> List[int]:
    """
    Convert a bounding box in resized-image coordinates back to original-image coordinates.

    Args:
        bbox:         [x1, y1, x2, y2] in resized space.
        scale_factor: Value returned by resize_for_ocr (original / resized).

    Returns:
        [x1, y1, x2, y2] rounded to integers in original image space.
    """
    return [int(round(v * scale_factor)) for v in bbox]


def poly_to_rect(poly: List[List[float]]) -> List[float]:
    """
    Convert PaddleOCR's 4-point polygon [[x1,y1],[x2,y2],[x3,y3],[x4,y4]]
    to an axis-aligned bounding rectangle [x_min, y_min, x_max, y_max].
    """
    xs = [pt[0] for pt in poly]
    ys = [pt[1] for pt in poly]
    return [min(xs), min(ys), max(xs), max(ys)]
