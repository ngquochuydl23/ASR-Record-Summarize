from fastapi import APIRouter, Request, UploadFile, File
from fastcrud.exceptions.http_exceptions import BadRequestException
from ...constants.http_msgs import NOT_WAV_FILE
from ...dtos.transcription import TranscriptionDto
from ...services.transcription_service import TranscriptionService


router = APIRouter(tags=["Transcription"])
transcription_service = TranscriptionService()

@router.post("/transcription/transcribe", response_model=TranscriptionDto, status_code=200)
async def inference(request: Request, audio_file: UploadFile = File(...)) -> dict[str, str]:
    if not audio_file.filename.endswith(".wav"):
        return BadRequestException(NOT_WAV_FILE)

    audio_bytes = await audio_file.read()
    return transcription_service.transcribe(audio_bytes)



