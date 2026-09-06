"""
tests/test_pipeline.py — Comprehensive test suite for PARAKH AI.
"""
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

from ai_label_scanner.app import app
from ai_label_scanner.pipeline import process_image
from ai_label_scanner.schemas.output import ScanResult

SAMPLE_DIR = Path(__file__).parent.parent.parent / "tests" / "sample_images"


@pytest.fixture(scope="module", autouse=True)
def ensure_samples():
    """Generate samples if not present."""
    if not (SAMPLE_DIR / "sunfeast_marie.jpg").exists():
        import subprocess, sys
        subprocess.run([sys.executable, str(Path(__file__).parent.parent.parent / "tests" / "generate_diverse_samples.py")], check=True)


def test_pipeline_normal_label():
    img_path = SAMPLE_DIR / "sunfeast_marie.jpg"
    result = process_image(str(img_path))

    assert isinstance(result, ScanResult)
    assert result.product_name == "SUNFEAST MARIE LIGHT"
    assert result.category == "Biscuits & Bakery"
    assert result.net_quantity.value == 200.0
    assert result.net_quantity.unit == "g"
    assert result.mrp.value == 20.0
    assert result.mrp.currency == "INR"
    assert result.manufacturer.text == "ITC Limited"
    assert result.batch_number.text == "SFM2501A"
    assert result.date_information.text == "Jan 2025"
    assert len(result.evidence_regions) >= 5
    assert result.overall_confidence > 0.8


def test_pipeline_lays_chips():
    img_path = SAMPLE_DIR / "lays_chips.jpg"
    result = process_image(str(img_path))

    assert result.product_name == "LAYS CLASSIC SALTED POTATO CHIPS"
    assert result.category == "Snacks & Munchies"
    assert result.net_quantity.value == 52.0
    assert result.net_quantity.unit == "g"
    assert result.mrp.value == 20.0
    assert result.batch_number.text == "L204A"
    assert result.date_information.text == "15/05/2025"
    assert result.manufacturer.needs_review is True
    assert result.manufacturer.confidence == 0.6


def test_pipeline_britannia_inverted_layout():
    img_path = SAMPLE_DIR / "britannia_cookies.jpg"
    result = process_image(str(img_path))

    assert result.product_name == "BRITANNIA GOOD DAY CASHEW COOKIES"
    assert result.category == "Biscuits & Bakery"
    assert result.mrp.value == 30.0
    assert result.net_quantity.value == 100.0
    assert result.batch_number.text == "B901X"


def test_pipeline_amul_milk():
    img_path = SAMPLE_DIR / "amul_hindi.jpg"
    result = process_image(str(img_path))

    assert result.product_name == "AMUL TAAZA MILK"
    assert result.category == "Dairy Products"
    assert result.net_quantity.value == 500.0
    assert result.net_quantity.unit == "ml"
    assert result.mrp.value == 27.0


def test_pipeline_maggi_noodles():
    img_path = SAMPLE_DIR / "maggi_noodles.jpg"
    result = process_image(str(img_path))

    assert result.product_name == "MAGGI 2-MINUTE NOODLES"
    assert result.category == "Instant Food & Noodles"
    assert result.net_quantity.value == 70.0
    assert result.mrp.value == 14.0
    assert result.batch_number.text == "MGL88"


def test_fastapi_scan_endpoint():
    client = TestClient(app)
    img_path = SAMPLE_DIR / "sunfeast_marie.jpg"

    with open(img_path, "rb") as f:
        response = client.post("/scan", files={"image": ("label.jpg", f, "image/jpeg")})

    assert response.status_code == 200
    data = response.json()
    assert data["product_name"] == "SUNFEAST MARIE LIGHT"
    assert data["net_quantity"]["value"] == 200.0
    assert data["mrp"]["value"] == 20.0
    assert "evidence_regions" in data
