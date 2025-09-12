from src.app.services.ffmpeg_service import FFMpegService
import asyncio

if __name__ == "__main__":
    asyncio.run(
        FFMpegService.extract_audio('./uploads/tedtalk-gao-luong-thuc.mp4', './wavs/tedtalk-gao-luong-thuc.wav')
    )
