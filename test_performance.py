"""
test_performance.py — Benchmark execution time for warm calls vs cold calls.
"""
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from ai_label_scanner.ocr.ocr_engine import engine as ocr_engine
from ai_label_scanner.pipeline import process_image

SAMPLE_PATH = Path(__file__).parent / "tests" / "sample_images" / "sunfeast_marie.jpg"


def benchmark():
    print("=" * 70)
    print("  PARAKH AI — Performance Benchmark & Timing Breakdown")
    print("=" * 70)

    # 1. Warmup
    t0 = time.perf_counter()
    ocr_engine.warmup()
    warmup_time = (time.perf_counter() - t0) * 1000.0
    print(f"\n  [1] Singleton Preload / Warmup Time : {warmup_time:.2f} ms")

    # 2. First request (warmed up engine)
    res1 = process_image(str(SAMPLE_PATH))
    print(f"  [2] 1st Post-Warmup Scan Request    : {res1.processing_time_ms:.2f} ms")

    # 3. Second request (repeat request in same process)
    res2 = process_image(str(SAMPLE_PATH))
    print(f"  [3] 2nd Repeat Scan Request         : {res2.processing_time_ms:.2f} ms")

    # 4. Third request
    res3 = process_image(str(SAMPLE_PATH))
    print(f"  [4] 3rd Repeat Scan Request         : {res3.processing_time_ms:.2f} ms")

    print("\n" + "=" * 70)
    print(f"  Average repeat processing time: {(res2.processing_time_ms + res3.processing_time_ms)/2.0:.2f} ms")
    print("=" * 70)


if __name__ == "__main__":
    benchmark()
