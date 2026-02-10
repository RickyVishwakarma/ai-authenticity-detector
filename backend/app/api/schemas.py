"""
Pydantic models for API request/response validation.
"""

from pydantic import BaseModel, Field
from typing import Literal
from enum import Enum


class ContentType(str, Enum):
    TEXT = "text"
    IMAGE = "image"
    VIDEO = "video"


class SignalWeight(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class TextAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=20, description="Text content to analyze")


class DetectionSignal(BaseModel):
    label: str
    weight: SignalWeight
    detail: str = ""


class AnalysisResponse(BaseModel):
    content_type: ContentType
    prediction: Literal["ai_generated", "human_created", "uncertain"]
    ai_probability: float = Field(..., ge=0, le=100)
    human_probability: float = Field(..., ge=0, le=100)
    signals: list[DetectionSignal]
    metrics: dict
    processing_time_ms: int
    disclaimer: str = "Probabilistic assessment. Not a definitive verdict."


class ErrorResponse(BaseModel):
    error: str
    detail: str = ""