from src.app.services.ffmpeg_service import FFMpegService
import asyncio

if __name__ == "__main__":
    asyncio.run(
        FFMpegService.extract_audio('./uploads/bdb5ec4c-df3c-4af7-9856-74f9e980e7b1.mp4', './wavs/mongodb.wav')
    )
