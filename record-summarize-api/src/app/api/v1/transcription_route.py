from fastapi import APIRouter, Request, UploadFile, File
from fastcrud.exceptions.http_exceptions import BadRequestException
from ...constants.http_msgs import NOT_WAV_FILE
from ...dtos.transcription import TranscriptionDto
from ...services.transcription_service import TranscriptionService

router = APIRouter(tags=["Transcription"])
transcription_service = TranscriptionService()


@router.post("/transcription/transcribe", status_code=200)
async def transcribe_local_file(audio_file: UploadFile = File(...)):
    if not audio_file.filename.endswith(".wav"):
        return BadRequestException(NOT_WAV_FILE)

    audio_bytes = await audio_file.read()
    text = await transcription_service.transcribe_only_with_bytes(audio_bytes)
    return TranscriptionDto(text=text)


@router.post("/transcription/transcribe/generate-vtt", status_code=200)
async def transcribe_local_file(audio_file: UploadFile = File(...)):
    if not audio_file.filename.endswith(".wav"):
        return BadRequestException(NOT_WAV_FILE)

    audio_bytes = await audio_file.read()
    text = await transcription_service.transcribe_only_with_bytes(audio_bytes)
    return TranscriptionDto(text=text)
