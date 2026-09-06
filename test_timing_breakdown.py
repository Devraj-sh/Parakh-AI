"""
test_timing_breakdown.py — Measure timing per stage in the pipeline.
"""
import time
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from ai_label_scanner.utils.image_io import load_image
from ai_label_scanner.preprocessing.pipeline import run_preprocessing
from ai_label_scanner.ocr.ocr_engine import engine as ocr_engine
from ai_label_scanner.extraction.field_extractor import extract_fields

SAMPLE_PATH = Path(__file__).parent / "tests" / "sample_images" / "sunfeast_marie.jpg"

ocr_engine.warmup()

img = load_image(str(SAMPLE_PATH))

# Stage 1: Preprocessing
t0 = time.perf_counter()
pre = run_preprocessing(img)
t_pre = (time.perf_counter() - t0) * 1000

# Stage 2: OCR Inference
t0 = time.perf_counter()
ocr_res = ocr_engine.run(pre.processed)
t_ocr = (time.perf_counter() - t0) * 1000

# Stage 3: Field Extraction & Evidence
t0 = time.perf_counter()
fields = extract_fields(ocr_res)
t_extract = (time.perf_counter() - t0) * 1000

print(f"Timing Breakdown:")
print(f"  1. Preprocessing (Quality + CLAHE/Perspective) : {t_pre:.2f} ms")
print(f"  2. PaddleOCR v3 Inference (Det + Ori + Rec)      : {t_ocr:.2f} ms")
print(f"  3. Hybrid Field Extraction & Post-processing    : {t_extract:.2f} ms")
