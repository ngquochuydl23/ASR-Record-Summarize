import uvicorn
import logging
import json
import os
import uuid
import asyncio
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse, RedirectResponse
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import FileResponse

from services.thumbnail_generator_service import ThumbnailGeneratorService
from middlewares.exception_handling_middleware import ExceptionHandlingMiddleware
from src.app.exceptions.app_exception import AppException
from src.app.utils.ffmpeg_util import check_ffmpeg
from utils.gpu_utils import check_gpu

EPS = 0.6
FPS = 1
METRIC = 'cosine'
UPLOAD_DIR = './uploads'
CHECKPOINT_PATH = 'src/models/cp-00030.keras'

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
tgenerator_service = ThumbnailGeneratorService(EPS, FPS, METRIC, CHECKPOINT_PATH)

app = FastAPI(title="ASR Record Thumbnail Generator Api")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://easysum-staging.pgonevn.com",
        "https://easysum.pgonevn.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.add_middleware(ExceptionHandlingMiddleware)


@app.get("/", include_in_schema=False)
async def index():
    return RedirectResponse(url="/docs")


@app.get("/record-tgenerator-api/ping", tags=["HealthChecks"])
async def ping():
    return "Pong"


@app.post("/record-tgenerator-api/generate", tags=["Thumbnail Generator"])
async def generate_thumbnail(file: UploadFile = File(...)):
    filename = str(uuid.uuid4())
    video_path = os.path.join(UPLOAD_DIR, f"{filename}.png")
    with open(video_path, "wb") as fw:
        content = await file.read()
        fw.write(content)
    result = await asyncio.to_thread(tgenerator_service.generate_thumbnail, video_path)
    if not result['best_thumbnail']:
        raise AppException("No thumbnail selected.")
    return FileResponse(result['best_thumbnail'], media_type="image/jpeg", filename=f"{filename}.png")

if __name__ == "__main__":
    check_gpu()
    check_ffmpeg()
    uvicorn.run(app, host="0.0.0.0", port=2026)
