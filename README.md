# PARAKH AI

> **AI-Powered Legal Metrology Compliance & Inspector Assistance Platform**

PARAKH AI is an intelligent inspection platform that helps Legal Metrology inspectors verify the compliance of packaged commodities using **Artificial Intelligence, Computer Vision, OCR, and a Rule-Based Compliance Engine**. The platform automates the first level of inspection by extracting mandatory product declarations, validating them against legal rules, highlighting evidence, and generating a transparent risk score for faster and more consistent decision-making.

---

## Overview

Traditional inspection of packaged products requires officers to manually verify declarations such as **MRP, Net Quantity, Manufacturer Details, Consumer Information, Barcode, and Legal Declarations**. This process is repetitive, time-consuming, and difficult to scale.

PARAKH AI transforms this workflow into a smart digital inspection process where inspectors simply scan the **back label** of a packaged product using a tablet. The AI analyzes the label, identifies compliance issues, highlights the exact evidence, and prioritizes products based on risk while keeping the inspector fully in control.

### Project Screenshot

![PARAKH AI Dashboard](Frontend/public/s.png)

---

## Key Features

- **AI Label Scanner** – Automatically detects and scans packaged product labels.
- **OCR Text Extraction** – Extracts MRP, Net Quantity, Manufacturer, Dates, and Consumer Details.
- **Rule-Based Compliance Engine** – Validates extracted information against Legal Metrology rules.
- **Evidence Lens** – Highlights the exact region responsible for every compliance finding.
- **Risk Score Engine** – Generates a transparent priority score for inspection.
- **Inspector Review Workflow** – Human-in-the-loop verification before final reporting.
- **Batch Screening** – Enables rapid inspection of multiple packaged products.

---

## How PARAKH AI Works

1. Capture the back label of a packaged product.
2. AI detects the label region using computer vision.
3. OCR extracts all visible declarations.
4. Compliance rules validate the extracted information.
5. Evidence Lens highlights potential violations.
6. Risk Engine generates the overall compliance score.
7. Inspector reviews and submits the final inspection report.

---

## System Architecture

```text
Packaged Product
        │
        ▼
 AI Label Detection
        │
        ▼
 OCR Text Extraction
        │
        ▼
 Structured Product Data
        │
        ▼
 Rule-Based Compliance Engine
        │
   ┌────┴────┐
   ▼         ▼
Evidence   Risk Score
   │         │
   └────┬────┘
        ▼
 Inspector Dashboard
        │
        ▼
 Review & Report
```

---

## Technology Stack

### Frontend
- React.js / Next.js
- Tailwind CSS
- Responsive Tablet Interface

### Backend
- FastAPI
- REST APIs
- Rule Validation Engine

### AI & Computer Vision
- OpenCV
- EasyOCR / Tesseract OCR
- Image Processing Pipeline

### Database
- PostgreSQL
- Inspection Records
- Compliance Rule Repository

---

## Project Structure

```text
PARAKH-AI/
│
├── frontend/
├── backend/
├── models/
├── rules/
├── screenshots/
│   └── overview.png
├── docs/
└── README.md
```

---

## Benefits

- Reduces repetitive manual inspection effort.
- Standardizes compliance verification across inspections.
- Provides explainable AI with visual evidence.
- Prioritizes high-risk products using transparent scoring.
- Generates structured inspection data for analytics and governance.

---

## Future Enhancements

- Multi-language OCR
- Offline inspection mode
- Voice-assisted inspection
- Warehouse batch screening
- Analytics dashboard
- Cloud synchronization

---

## License

This project is intended for research, development, and demonstration purposes.
