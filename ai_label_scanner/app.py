"""
app.py — FastAPI application for PARAKH AI Label Scanner.
POST /scan — multipart/form-data image upload → JSON ScanResult.
"""
import os
import sys
from pathlib import Path
from contextlib import asynccontextmanager
import logging

# Ensure project root is in sys.path when executed directly
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from ai_label_scanner.schemas.output import ScanResult
from ai_label_scanner.pipeline import process_image
from ai_label_scanner.ocr.ocr_engine import engine as ocr_engine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup & shutdown events for FastAPI.
    Warms up PaddleOCR model singleton at server boot time.
    """
    logger.info("Initializing application & warming up PaddleOCR singleton...")
    ocr_engine.warmup()
    logger.info("Application startup complete. Ready to handle requests.")
    yield
    logger.info("Application shutdown.")


app = FastAPI(
    title="PARAKH AI Label Scanner",
    description="OCR-based packaged product label scanner API (SIH26034)",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "module": "PARAKH AI Label Scanner"}


@app.post("/scan", response_model=ScanResult)
async def scan(image: UploadFile = File(...)):
    """
    Accepts a product label image via multipart/form-data and returns structured ScanResult JSON.
    """
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")

    contents = await image.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty image upload.")

    try:
        result = process_image(contents)
        return result
    except Exception as e:
        logger.error("Error processing image in /scan: %s", str(e), exc_info=True)
        raise HTTPException(status_code=500, detail=f"Label scanning failed: {str(e)}")


if __name__ == "__main__":
    uvicorn.run("ai_label_scanner.app:app", host="0.0.0.0", port=8000, reload=True)
