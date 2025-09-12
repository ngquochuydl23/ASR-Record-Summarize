import librosa
import os
import soundfile as sf
import io
from datetime import timedelta
from src.ai_modules.vie_asr_model.vie_asr_ai_model import VieASRAIModel
import torchaudio

class TranscriptionService:
    def __init__(self):
        self.vie_ai_model = VieASRAIModel()
        self.vie_ai_model.load_from_checkpoints()

    async def transcribe_only_with_bytes(self, audio_bytes: bytes, lang='vie') -> str:
        waveform, sample_rate = torchaudio.load(io.BytesIO(audio_bytes))
        if waveform.shape[0] > 1:
            waveform = waveform.mean(dim=0)
        waveform = waveform.squeeze().numpy()
        return await self.vie_ai_model.get_text(waveform)

    async def transcribe_only(self, wav_path: str, lang='vie') -> str:
        speech, sr = librosa.load(wav_path, sr=16000)
        return await self.vie_ai_model.get_text(speech.squeeze())
