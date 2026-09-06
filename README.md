# PARAKH AI — AI Label Scanner / OCR Engine (SIH26034)

Production-quality OCR & structured field extraction module for Indian packaged products.

## Features
- **Conditional Image Preprocessing**: Blur detection (Laplacian variance) + Brightness analysis (CLAHE on LAB L-channel) + Perspective correction without prior thresholding/binarization.
- **Dual-Pass PaddleOCR Engine**: Primary English pass + automatic secondary Devanagari (Hindi) pass with IoU spatial deduplication.
- **Hybrid Field Extraction**: Keyword anchoring + Regex rules + Spatial proximity + Title font height heuristics.
- **Weighted Confidence Scoring**: `0.4*ocr_conf + 0.3*keyword_score + 0.2*regex_valid + 0.1*spatial_prox`.
- **Right-Edge Truncation Detection**: Boundary text clipping detection capping confidence at `0.6` with `needs_review: true` flags.
- **FastAPI Endpoint**: `POST /scan` returning validated Pydantic JSON contracts.

## API Usage

Start server:
```bash
python3 ai_label_scanner/app.py
```

Open Swagger UI at `http://localhost:8000/docs` or upload via cURL:
```bash
curl -X POST "http://localhost:8000/scan" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "image=@tests/sample_images/sunfeast_marie.jpg"
```
