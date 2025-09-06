from src.ai_modules.wav2text import Wav2TextModule


class TranscriptionService:
    def __init__(self):
        self.wav2text_module = Wav2TextModule()

    def transcribe(self, waveform):
        result = self.wav2text_module.decode_wav(waveform)
        return {"text": result[0]}