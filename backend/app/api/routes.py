
import time
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.api.schemas import (
    TextAnalysisRequest,
    AnalysisResponse,
    ContentType,
)
from app.services.text_analyzer import TextAnalyzer
from app.services.image_analyzer import ImageAnalyzer
from app.services.video_analyzer import VideoAnalyzer

router = APIRouter()
text_analyzer = TextAnalyzer()
image_analyzer = ImageAnalyzer()
video_analyzer = VideoAnalyzer()

ALLOWED_IMAGE_TYPES = {"image/png", "image/jpeg", "image/webp", "image/gif"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/webm", "video/quicktime"}
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100 MB


@router.post("/analyze/text", response_model=AnalysisResponse)
async def analyze_text(request: TextAnalysisRequest):
    start = time.time()
    try:
        result = text_analyzer.analyze(request.text)
        result["processing_time_ms"] = int((time.time() - start) * 1000)
        result["content_type"] = ContentType.TEXT
        return AnalysisResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze/image", response_model=AnalysisResponse)
async def analyze_image(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail=f"Invalid file type: {file.content_type}")

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max 100MB.")

    start = time.time()
    try:
        result = image_analyzer.analyze(contents, file.filename, file.content_type)
        result["processing_time_ms"] = int((time.time() - start) * 1000)
        result["content_type"] = ContentType.IMAGE
        return AnalysisResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze/video", response_model=AnalysisResponse)
async def analyze_video(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_VIDEO_TYPES:
        raise HTTPException(status_code=400, detail=f"Invalid file type: {file.content_type}")

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max 100MB.")

    start = time.time()
    try:
        result = video_analyzer.analyze(contents, file.filename)
        result["processing_time_ms"] = int((time.time() - start) * 1000)
        result["content_type"] = ContentType.VIDEO
        return AnalysisResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
