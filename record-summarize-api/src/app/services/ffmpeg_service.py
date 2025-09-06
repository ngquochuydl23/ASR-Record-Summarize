import os
from ..core.logger import logging
from typing import Any
import asyncio

class FFMpegService:
    def __init__(self):
        os.makedirs("./wavs", exist_ok=True)

    @staticmethod
    async def extract_audio(input_file: str, output_file: str) -> dict[str, Any]:
        process = await asyncio.create_subprocess_exec(
            "ffmpeg",
            "-y",
            "-i", input_file,
            "-acodec",
            "pcm_s16le",
            "-ar",
            "16000",
            output_file,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        stdout, stderr = await process.communicate()
        if process.returncode != 0:
            error_message = stderr.decode("utf-8")
            logging.error(f"FFmpeg failed: {error_message}")
            raise RuntimeError(f"FFmpeg failed: {error_message}")

        return {
            "sampling_rate": 16000,
            "output": output_file,
        }
