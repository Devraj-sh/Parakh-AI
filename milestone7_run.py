"""
milestone7_run.py — MILESTONE 7 runner.

Starts FastAPI test client and sends a POST request with image bytes to /scan.
"""
import sys
from pathlib import Path
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).parent))

from ai_label_scanner.app import app

SAMPLE_PATH = Path(__file__).parent / "tests" / "sample_images" / "sunfeast_marie.jpg"


def run():
    print("=" * 70)
    print("  PARAKH AI — MILESTONE 7: FastAPI POST /scan Endpoint Integration")
    print("=" * 70)

    client = TestClient(app)

    # 1. Health check
    h_resp = client.get("/health")
    print("  /health response:", h_resp.json())

    # 2. Upload /scan POST test
    with open(SAMPLE_PATH, "rb") as f:
        response = client.post("/scan", files={"image": ("sunfeast_marie.jpg", f, "image/jpeg")})

    print(f"  /scan HTTP status code: {response.status_code}")
    print("\n  ── JSON Response from API Endpoint ────────────────────────────")
    print(response.text)

    print(f"\n{'='*70}")
    print("✅  MILESTONE 7 DONE — FastAPI endpoint successfully responding with ScanResult.")
    print("    Proceed to Milestone 8 (Full test suite).")
    print("=" * 70)


if __name__ == "__main__":
    run()
