"""
schemas/output.py — Pydantic models for the PARAKH AI JSON output contract.
"""
from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class QuantityField(BaseModel):
    value: Optional[float] = None
    unit: Optional[str] = None
    confidence: float = Field(0.0, ge=0.0, le=1.0)


class TextField(BaseModel):
    text: Optional[str] = None
    confidence: float = Field(0.0, ge=0.0, le=1.0)
    needs_review: bool = False


class MRPField(BaseModel):
    value: Optional[float] = None
    currency: str = "INR"
    confidence: float = Field(0.0, ge=0.0, le=1.0)


class EvidenceRegion(BaseModel):
    field: str
    text: str
    bbox: List[int] = Field(description="[x1, y1, x2, y2] in original image coordinates")
    confidence: float = Field(0.0, ge=0.0, le=1.0)
    needs_review: bool = False


class ScanResult(BaseModel):
    product_name: Optional[str] = None
    category: Optional[str] = None
    net_quantity: QuantityField = Field(default_factory=QuantityField)
    mrp: MRPField = Field(default_factory=MRPField)
    manufacturer: TextField = Field(default_factory=TextField)
    batch_number: TextField = Field(default_factory=TextField)
    date_information: TextField = Field(default_factory=TextField)
    evidence_regions: List[EvidenceRegion] = Field(default_factory=list)
    overall_confidence: float = Field(0.0, ge=0.0, le=1.0)
    processing_time_ms: float = 0.0
