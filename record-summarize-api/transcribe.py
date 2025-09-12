from src.ai_modules.vie_asr_model.vie_asr_ai_model import VieASRAIModel
import asyncio
import librosa
import torch


async def transcribe():
    vie_asr_ai_model = VieASRAIModel()
    vie_asr_ai_model.load_from_checkpoints()
    if not torch.cuda.is_available():
        print("⚠️ No GPU found, using CPU")
        return

    print(f"✅ Using GPU: {torch.cuda.get_device_name(0)}")

    speech, sr = librosa.load("wavs/yeunhau.wav", sr=16000)
    text = await vie_asr_ai_model.get_text(speech, sr)
    print("Prediction:", text)


async def generate_vtt():
    vie_asr_ai_model = VieASRAIModel()
    vie_asr_ai_model.load_from_checkpoints()
    if not torch.cuda.is_available():
        print("⚠️ No GPU found, using CPU")
        return

    print(f"✅ Using GPU: {torch.cuda.get_device_name(0)}")
    speech, sr = librosa.load("wavs/tedtalk-gao-luong-thuc.wav", sr=16000)
    try:
        lines = await vie_asr_ai_model.generate_vtt(speech, output_path='./vtts/tedtalk-gao-luong-thuc.vtt',saved=True)
        print(lines)
    except Exception as e:
        print(str(e))


if __name__ == "__main__":
    asyncio.run(generate_vtt())
