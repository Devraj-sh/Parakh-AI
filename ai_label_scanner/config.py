"""
config.py — Central configuration for PARAKH AI Label Scanner.
All thresholds, keyword lists, and scoring weights live here.
"""

# ──────────────────────────────────────────────
# Image quality thresholds
# ──────────────────────────────────────────────
BLUR_THRESHOLD = 100.0          # Laplacian variance below this → image is blurry
BRIGHTNESS_LOW_THRESHOLD = 50   # Mean pixel brightness below this → image is dark
BRIGHTNESS_HIGH_THRESHOLD = 220 # Mean pixel brightness above this → image is over-exposed

# ──────────────────────────────────────────────
# Preprocessing parameters
# ──────────────────────────────────────────────
CLAHE_CLIP_LIMIT = 2.0
CLAHE_TILE_GRID = (8, 8)
SHARPEN_STRENGTH = 1.5          # Weight for unsharp mask
MAX_IMAGE_DIMENSION = 2000      # Resize longest edge to this before OCR

# ──────────────────────────────────────────────
# OCR engine settings (PaddleOCR v3 / PaddleX API)
# ──────────────────────────────────────────────
OCR_LANG_PRIMARY = "en"
OCR_LANG_SECONDARY = "ch"   # PaddleOCR v3 uses 'ch' for Chinese+Devanagari coverage;
                              # switch to 'hi' when a Hindi-specific model is released
OCR_USE_ANGLE_CLS = True      # kept for compatibility; v3 maps this to use_textline_orientation
OCR_USE_TEXTLINE_ORIENTATION = True  # v3 equivalent of use_angle_cls

# ──────────────────────────────────────────────
# Field extraction keywords (case-insensitive)
# Ordered from most specific to least specific
# ──────────────────────────────────────────────
KEYWORDS = {
    "mrp": [
        "mrp", "m.r.p", "maximum retail price", "max. retail price",
        "maximum price", "retail price", "rs.", "₹",
    ],
    "net_quantity": [
        "net wt", "net weight", "net qty", "net quantity",
        "net contents", "nett wt", "nett weight", "net vol",
        "net volume", "contents", "wt.",
    ],
    "manufacturer": [
        "manufactured by", "mfg by", "mfd by", "manufactured for",
        "mfr.", "marketed by", "packed by", "pkd by",
        "distributed by", "imported by",
    ],
    "batch_number": [
        "batch no", "batch number", "batch", "lot no", "lot number",
        "b.no", "b no", "batch#",
    ],
    "date_information": [
        "mfg date", "mfg.", "mfd", "manufacturing date",
        "packed on", "pkg date", "exp date", "expiry date",
        "best before", "use by", "use before", "exp.", "bb",
    ],
    "product_name": [],   # Heuristic: topmost / largest text block
    "category": [],       # Inferred from product name context
}

# ──────────────────────────────────────────────
# Regex patterns for field values
# ──────────────────────────────────────────────
import re

REGEX_PATTERNS = {
    "mrp": re.compile(
        r"(?:rs\.?\s*|₹\s*|inr\s*)(\d+(?:[.,]\d{1,2})?)",
        re.IGNORECASE,
    ),
    "net_quantity": re.compile(
        r"(\d+(?:[.,]\d+)?)\s*"
        r"(kg|g|gm|gms|gram|grams|ml|l|ltr|litre|liters|mg|oz|lb|pcs|pc|nos|units?)",
        re.IGNORECASE,
    ),
    "batch_number": re.compile(
        r"\b([A-Z0-9][A-Z0-9\-/]{2,})\b",
        re.IGNORECASE,
    ),
    "date_information": re.compile(
        r"\b(\d{1,2}[/\-\.]\d{1,2}[/\-\.]\d{2,4}"   # DD/MM/YYYY
        r"|\d{4}[/\-\.]\d{1,2}[/\-\.]\d{1,2}"         # YYYY/MM/DD
        r"|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*"
        r"[\s\-/\.]\d{2,4})\b",                         # Mon YYYY
        re.IGNORECASE,
    ),
}

# ──────────────────────────────────────────────
# Confidence scoring weights (must sum to 1.0)
# ──────────────────────────────────────────────
CONFIDENCE_WEIGHTS = {
    "ocr_confidence":          0.4,
    "keyword_match_score":     0.3,
    "regex_validity":          0.2,
    "spatial_proximity_score": 0.1,
}

# ──────────────────────────────────────────────
# Evidence / spatial settings
# ──────────────────────────────────────────────
SPATIAL_NEIGHBOR_LINES = 2   # How many OCR lines above/below the keyword to search
SPATIAL_MAX_DISTANCE_PX = 500  # Beyond this pixel distance → proximity score = 0

# ──────────────────────────────────────────────
# Overall confidence aggregation
# ──────────────────────────────────────────────
OVERALL_CONFIDENCE_FIELD_WEIGHTS = {
    "mrp":            0.25,
    "net_quantity":   0.20,
    "manufacturer":   0.15,
    "batch_number":   0.15,
    "date_information": 0.15,
    "product_name":   0.10,
}
