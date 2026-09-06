"""
tests/generate_samples.py — Generate synthetic Indian packaged product label images
for testing the PARAKH AI pipeline.

Produces:
  sunfeast_marie.jpg    — normal image  (good quality)
  dark_label.jpg        — dark/under-exposed label  (triggers CLAHE)
  blurry_label.jpg      — motion-blurred label       (triggers sharpen)
  rotated_label.jpg     — ~15° rotated label         (tests angle correction)
"""
import sys
from pathlib import Path

import cv2
import numpy as np

OUT_DIR = Path(__file__).parent / "sample_images"
OUT_DIR.mkdir(parents=True, exist_ok=True)

FONT = cv2.FONT_HERSHEY_SIMPLEX


def _draw_label(
    width: int = 640,
    height: int = 800,
    bg_color=(245, 245, 245),
    header_color=(0, 180, 240),
    text_color=(10, 10, 10),
    title_color=(20, 20, 180),
    product: str = "SUNFEAST MARIE LIGHT",
    subtitle: str = "BISCUITS",
) -> np.ndarray:
    """Render a generic Indian packaged product label."""
    img = np.ones((height, width, 3), dtype=np.uint8) * np.array(bg_color, dtype=np.uint8)

    # Header band
    img[0:140] = header_color

    # Product name
    cv2.putText(img, product, (30, 80), FONT, 1.2, title_color, 3, cv2.LINE_AA)
    cv2.putText(img, subtitle, (200, 125), FONT, 1.0, title_color, 3, cv2.LINE_AA)

    # Field rows
    fields = [
        (160, "Net Wt.: 200g"),
        (210, "MRP: Rs. 20 (Incl. of all taxes)"),
        (260, "Mfg. Date: Jan 2025"),
        (310, "Exp. Date: Dec 2025"),
        (360, "Batch No: SFM2501A"),
        (410, "Manufactured by: ITC Limited,"),
        (445, "Virginia House, 37 J.L. Nehru Road,"),
        (480, "Kolkata - 700071"),
        (540, "Customer Care: 1800-345-6789"),
        (590, "www.itcportal.com"),
        (650, "FSSAI Lic. No.: 10013022002253"),
        (700, "Best Before: See top of pack"),
        (750, "Country of Origin: India"),
    ]
    for y, text in fields:
        cv2.putText(img, text, (30, y), FONT, 0.7, text_color, 2, cv2.LINE_AA)

    # Border
    cv2.rectangle(img, (5, 5), (width - 5, height - 5), (80, 80, 80), 3)
    return img


def generate_normal() -> str:
    img = _draw_label()
    path = str(OUT_DIR / "sunfeast_marie.jpg")
    cv2.imwrite(path, img, [cv2.IMWRITE_JPEG_QUALITY, 95])
    print(f"[normal]  → {path}")
    return path


def generate_dark() -> str:
    """Simulate under-exposed / poor-lighting scan (brightness ~35)."""
    img = _draw_label(bg_color=(30, 30, 30), header_color=(0, 60, 80),
                      text_color=(180, 180, 180), title_color=(100, 100, 200))
    # Additional gamma darken
    lut = np.array([int(i ** 0.45) for i in range(256)], dtype=np.uint8)
    img = cv2.LUT(img, lut)
    path = str(OUT_DIR / "dark_label.jpg")
    cv2.imwrite(path, img, [cv2.IMWRITE_JPEG_QUALITY, 95])
    print(f"[dark]    → {path}")
    return path


def generate_blurry() -> str:
    """Simulate camera motion blur."""
    img = _draw_label()
    # Motion blur kernel (horizontal)
    k_size = 21
    kernel = np.zeros((k_size, k_size), dtype=np.float32)
    kernel[k_size // 2, :] = 1.0 / k_size
    img = cv2.filter2D(img, -1, kernel)
    # Add slight Gaussian blur on top
    img = cv2.GaussianBlur(img, (5, 5), 2)
    path = str(OUT_DIR / "blurry_label.jpg")
    cv2.imwrite(path, img, [cv2.IMWRITE_JPEG_QUALITY, 90])
    print(f"[blurry]  → {path}")
    return path


def generate_rotated() -> str:
    """Simulate a slightly rotated label photo."""
    img = _draw_label()
    h, w = img.shape[:2]
    angle = 12  # degrees
    M = cv2.getRotationMatrix2D((w // 2, h // 2), angle, 1.0)
    # Expand canvas so nothing is cropped
    cos, sin = abs(M[0, 0]), abs(M[0, 1])
    new_w = int(h * sin + w * cos)
    new_h = int(h * cos + w * sin)
    M[0, 2] += (new_w - w) / 2
    M[1, 2] += (new_h - h) / 2
    rotated = cv2.warpAffine(img, M, (new_w, new_h),
                             borderValue=(220, 220, 220))
    path = str(OUT_DIR / "rotated_label.jpg")
    cv2.imwrite(path, rotated, [cv2.IMWRITE_JPEG_QUALITY, 95])
    print(f"[rotated] → {path}")
    return path


if __name__ == "__main__":
    print(f"Generating sample images in: {OUT_DIR}")
    generate_normal()
    generate_dark()
    generate_blurry()
    generate_rotated()
    print("\nDone.")
