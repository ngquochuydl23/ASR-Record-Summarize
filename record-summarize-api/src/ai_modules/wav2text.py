from transformers import SpeechEncoderDecoderModel
from transformers import AutoFeatureExtractor, AutoTokenizer, GenerationConfig
import torchaudio
import torch
import io
torchaudio.set_audio_backend("soundfile")

class Wav2TextModule:
    def __init__(self, model_path = 'nguyenvulebinh/wav2vec2-bartpho'):
        self.model_path = model_path
        self.model = SpeechEncoderDecoderModel.from_pretrained(model_path).eval()
        self.feature_extractor = AutoFeatureExtractor.from_pretrained(model_path)
        self.tokenizer = AutoTokenizer.from_pretrained(model_path)

    def decode_tokens(self, token_ids, skip_special_tokens=True, time_precision=0.02):
        timestamp_begin = self.tokenizer.vocab_size
        outputs = [[]]
        for token in token_ids:
            if token >= timestamp_begin:
                timestamp = f" |{(token - timestamp_begin) * time_precision:.2f}| "
                outputs.append(timestamp)
                outputs.append([])
            else:
                outputs[-1].append(token)
        outputs = [
            s if isinstance(s, str) else self.tokenizer.decode(s, skip_special_tokens=skip_special_tokens) for s in outputs
        ]
        return "".join(outputs).replace("< |", "<|").replace("| >", "|>")

    def decode_wav(self, audio_bytes, prefix="", target_sr: int = 16000):
        waveform, sample_rate = torchaudio.load(io.BytesIO(audio_bytes))

        if waveform.shape[0] > 1:
            waveform = waveform.mean(dim=0, keepdim=True)

            # Resample if needed
        if sample_rate != target_sr:
            waveform = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=target_sr)(waveform)

        device = next(self.model.parameters()).device
        input_values = self.feature_extractor.pad(
            [{"input_values": feature} for feature in waveform],
            padding=True,
            max_length=None,
            pad_to_multiple_of=None,
            return_tensors="pt",
        )

        output_beam_ids = self.model.generate(
            input_values['input_values'].to(device),
            attention_mask=input_values['attention_mask'].to(device),
            decoder_input_ids=self.tokenizer.batch_encode_plus([prefix] * len(waveform), return_tensors="pt")['input_ids'][
                              ..., :-1].to(device),
            generation_config=GenerationConfig(decoder_start_token_id=self.tokenizer.bos_token_id),
            max_length=250,
            num_beams=25,
            no_repeat_ngram_size=4,
            num_return_sequences=1,
            early_stopping=True,
            return_dict_in_generate=True,
            output_scores=True,
        )

        output_text = [self.decode_tokens(sequence) for sequence in output_beam_ids.sequences]
        return output_text