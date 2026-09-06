"""
extraction/normalizer.py — Text normalisation and cleaning.
"""
import re
import unicodedata
from typing import Optional, Tuple
from ai_label_scanner.config import REGEX_PATTERNS


def normalize_text(text: str) -> str:
    """
    Clean up whitespace and standardise characters.
    """
    if not text:
        return ""
    # Normalize unicode (e.g. non-breaking spaces, symbols)
    text = unicodedata.normalize("NFKC", text)
    # Replace any multi-whitespace with single space
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def strip_trailing_punctuation(text: str) -> str:
    """
    Strip trailing punctuation (commas, periods, colons, semicolons, dashes) from text.
    """
    if not text:
        return ""
    # Strip trailing punctuation marks and spaces
    return re.sub(r"[\s,.:;\-]+$", "", text).strip()


def parse_mrp(text: str) -> Optional[float]:
    """
    Extract numeric MRP value from text like 'MRP: Rs. 20 (Incl. of all taxes)' -> 20.0
    """
    match = re.search(r"(?:rs\.?|₹|inr)\s*(\d+(?:[.,]\d{1,2})?)", text, re.IGNORECASE)
    if not match:
        # Fallback to any standalone currency number pattern if anchor was strong
        match = re.search(r"\b(\d+(?:[.,]\d{1,2})?)\b", text)
    if match:
        val_str = match.group(1).replace(",", ".")
        try:
            return float(val_str)
        except ValueError:
            return None
    return None


def parse_net_quantity(text: str) -> Tuple[Optional[float], Optional[str]]:
    """
    Extract net quantity value and unit from text like 'Net Wt.: 200g' -> (200.0, 'g')
    """
    match = re.search(
        r"(\d+(?:[.,]\d+)?)\s*(kg|g|gm|gms|gram|grams|ml|l|ltr|litre|liters|mg|oz|lb|pcs|pc|nos|units?)",
        text,
        re.IGNORECASE,
    )
    if match:
        val_str = match.group(1).replace(",", ".")
        unit = match.group(2).lower()
        # Normalize unit names
        if unit in ["gm", "gms", "gram", "grams"]:
            unit = "g"
        elif unit in ["ltr", "litre", "liters"]:
            unit = "l"
        elif unit in ["pc", "units"]:
            unit = "pcs"
        try:
            return float(val_str), unit
        except ValueError:
            return None, None
    return None, None


def clean_keyword_prefix(text: str, keywords: list) -> str:
    """
    Strip matched keyword prefixes from text to isolate values and remove trailing punctuation.
    E.g., 'Batch No: SFM2501A' -> 'SFM2501A'
    'Manufactured by: ITC Limited,' -> 'ITC Limited'
    """
    cleaned = text
    for kw in keywords:
        pattern = re.compile(re.escape(kw) + r"\s*[:\-\.]*\s*", re.IGNORECASE)
        cleaned = pattern.sub("", cleaned)
    return strip_trailing_punctuation(cleaned)


def parse_date_value(text: str, keywords: list) -> str:
    """
    Extract ONLY the date value from text (e.g. 'Mfg. Date: Jan 2025' -> 'Jan 2025').
    Uses date regex pattern if available, or strips keyword prefix.
    """
    date_pattern = REGEX_PATTERNS.get("date_information")
    if date_pattern:
        match = date_pattern.search(text)
        if match:
            return strip_trailing_punctuation(match.group(0))

    # Fallback to cleaning keyword prefix
    return clean_keyword_prefix(text, keywords)
