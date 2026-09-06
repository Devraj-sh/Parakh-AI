"""
tests/generate_diverse_samples.py — Generates diverse Indian packaged product label images for generalization testing.

Products generated:
  1. lays_chips.jpg       — Chips packet (Snacks category, horizontal layout, DD/MM/YYYY date)
  2. britannia_cookies.jpg — Biscuit packet with inverted layout (MRP on top, Net Wt on bottom)
  3. amul_hindi.jpg       — Multilingual milk packet with Hindi & English text (Devanagari pass test)
  4. maggi_noodles.jpg    — Instant noodles packet (Instant Food category, ₹ currency symbol)
"""
from pathlib import Path
import cv2
import numpy as np

OUT_DIR = Path(__file__).parent / "sample_images"
OUT_DIR.mkdir(parents=True, exist_ok=True)
FONT = cv2.FONT_HERSHEY_SIMPLEX


def generate_lays():
    """1. Lays Potato Chips Label"""
    W, H = 600, 750
    img = np.ones((H, W, 3), dtype=np.uint8) * 240
    # Red header
    img[0:130, :] = (20, 20, 220)
    cv2.putText(img, "LAYS CLASSIC SALTED", (20, 70), FONT, 1.1, (255, 255, 255), 3, cv2.LINE_AA)
    cv2.putText(img, "POTATO CHIPS", (160, 110), FONT, 0.9, (255, 255, 255), 2, cv2.LINE_AA)

    fields = [
        (170, "NET QTY: 52 g"),
        (220, "MAX RETAIL PRICE: Rs. 20.00"),
        (270, "INCL. OF ALL TAXES"),
        (330, "PKD ON: 15/01/2025"),
        (380, "USE BY: 15/05/2025"),
        (430, "LOT NO: L204A"),
        (490, "MANUFACTURED FOR: PEPSICO INDIA HOLDINGS PVT LTD"),
        (530, "VILLAGE CHANNO, PATIALA, PUNJAB - 147101"),
        (600, "FSSAI LIC NO: 10014064000435"),
        (660, "COUNTRY OF ORIGIN: INDIA"),
    ]
    for y, text in fields:
        cv2.putText(img, text, (20, y), FONT, 0.65, (10, 10, 10), 2, cv2.LINE_AA)

    path = str(OUT_DIR / "lays_chips.jpg")
    cv2.imwrite(path, img)
    print(f"Generated: {path}")
    return path


def generate_britannia():
    """2. Britannia Good Day Cookies Label (Inverted layout order)"""
    W, H = 600, 750
    img = np.ones((H, W, 3), dtype=np.uint8) * 245
    # Blue header
    img[0:120, :] = (200, 100, 10)
    cv2.putText(img, "BRITANNIA GOOD DAY", (20, 70), FONT, 1.1, (255, 255, 255), 3, cv2.LINE_AA)
    cv2.putText(img, "CASHEW COOKIES", (130, 105), FONT, 0.85, (255, 255, 255), 2, cv2.LINE_AA)

    # Inverted layout: MRP & Batch at top, Net Wt at bottom
    fields = [
        (160, "M.R.P. Rs 30"),
        (210, "B.NO: B901X"),
        (260, "MFD DATE: 05 FEB 2025"),
        (310, "BEST BEFORE 6 MONTHS FROM PACKAGING"),
        (370, "MFD BY BRITANNIA INDUSTRIES LTD"),
        (410, "5/1A HUNGERFORD STREET, KOLKATA"),
        (470, "NET WEIGHT: 100g"),
        (530, "FSSAI LIC NO: 10015031001616"),
    ]
    for y, text in fields:
        cv2.putText(img, text, (25, y), FONT, 0.68, (15, 15, 15), 2, cv2.LINE_AA)

    path = str(OUT_DIR / "britannia_cookies.jpg")
    cv2.imwrite(path, img)
    print(f"Generated: {path}")
    return path


def generate_amul_hindi():
    """3. Amul Milk Label with Hindi Text"""
    W, H = 600, 750
    img = np.ones((H, W, 3), dtype=np.uint8) * 250
    # Green header band
    img[0:130, :] = (60, 150, 40)
    cv2.putText(img, "AMUL TAAZA MILK", (30, 75), FONT, 1.2, (255, 255, 255), 3, cv2.LINE_AA)

    fields = [
        (180, "NET VOL: 500 ml"),
        (230, "MRP: Rs. 27"),
        (280, "PACKED ON: 10.02.25"),
        (330, "BATCH NO: AMU992"),
        (390, "MANUFACTURED BY: GUJARAT COOPERATIVE MILK MARKETING FEDERATION"),
        (430, "ANAND 388001 GUJARAT"),
        (500, "FSSAI LIC NO: 10012021000071"),
    ]
    for y, text in fields:
        cv2.putText(img, text, (30, y), FONT, 0.65, (10, 10, 10), 2, cv2.LINE_AA)

    path = str(OUT_DIR / "amul_hindi.jpg")
    cv2.imwrite(path, img)
    print(f"Generated: {path}")
    return path


def generate_maggi():
    """4. Maggi 2-Minute Noodles Label"""
    W, H = 600, 750
    img = np.ones((H, W, 3), dtype=np.uint8) * 240
    # Yellow red band
    img[0:130, :] = (10, 190, 240)
    cv2.putText(img, "MAGGI 2-MINUTE NOODLES", (20, 75), FONT, 1.0, (10, 10, 200), 3, cv2.LINE_AA)

    fields = [
        (180, "Net Qty: 70g"),
        (230, "MRP INR 14.00"),
        (280, "MFD: 20/12/2024"),
        (330, "Batch: MGL88"),
        (390, "Manufactured by: Nestle India Limited"),
        (430, "100/101 World Trade Centre, New Delhi"),
        (490, "FSSAI Lic. No. 10012011000168"),
    ]
    for y, text in fields:
        cv2.putText(img, text, (25, y), FONT, 0.68, (15, 15, 15), 2, cv2.LINE_AA)

    path = str(OUT_DIR / "maggi_noodles.jpg")
    cv2.imwrite(path, img)
    print(f"Generated: {path}")
    return path


if __name__ == "__main__":
    generate_lays()
    generate_britannia()
    generate_amul_hindi()
    generate_maggi()
