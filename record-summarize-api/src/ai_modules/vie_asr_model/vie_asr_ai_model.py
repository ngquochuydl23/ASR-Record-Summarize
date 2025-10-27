import torch
import os
import asyncio
from transformers import Wav2Vec2ForCTC, Wav2Vec2FeatureExtractor, Wav2Vec2CTCTokenizer, Wav2Vec2Processor
from src.app.core.logger import logging
from src.app.utils.vtt_utils import generate_vtt


class VieASRAIModel:
    def __init__(self, pretrained_path='nguyenvulebinh/wav2vec2-base-vietnamese-250h'):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.special_tokens = {
            "bos_token": "<bos>",
            "eos_token": "<eos>",
            "unk_token": "<unk>",
            "pad_token": "<pad>"
        }
        self.pretrained_path = pretrained_path
        self.tokenizer = Wav2Vec2CTCTokenizer(
            "src/ai_modules/vie_asr_model/vocab.json",
            **self.special_tokens,
            word_delimiter_token="|"
        )
        self.feature_extractor = Wav2Vec2FeatureExtractor.from_pretrained(self.pretrained_path)
        self.processor = Wav2Vec2Processor(feature_extractor=self.feature_extractor, tokenizer=self.tokenizer)
        self.model = Wav2Vec2ForCTC.from_pretrained(pretrained_path).to(self.device)

    def load_from_checkpoints(self, checkpoint_name="best_model_21-10-2025.tar"):
        checkpoint_path = os.path.join('./models', checkpoint_name)
        if not os.path.isfile(checkpoint_path):
            logging.warning(f"No checkpoint found at {checkpoint_path}.")
            return
        checkpoint = torch.load(checkpoint_path, map_location=self.device)
        self.model.load_state_dict(checkpoint['model'])
        self.model.to(self.device)
        return self.model, checkpoint

    def get_pretrained_model(self):
        return self.model

    def get_processor(self):
        return self.processor

    async def _get_text_chunk(self, speech_array, sampling_rate=16000):
        inputs = self.processor(speech_array, sampling_rate=sampling_rate, return_tensors="pt", padding=True).to(
            self.device)
        self.model.eval()

        def forward_pass():
            with torch.no_grad():
                logits = self.model(**inputs).logits
            predicted_ids = torch.argmax(logits, dim=-1)
            results = self.processor.batch_decode(predicted_ids)
            return results, predicted_ids, logits

        result, predicted_ids, logits = await asyncio.to_thread(forward_pass)
        return result[0], predicted_ids, logits

    async def get_text(self, speech_array, sampling_rate=16000, chunk_length_s=20):
        """
                Dùng cho audio dài: tự động cắt thành chunks và ghép text lại
                :param speech_array: numpy array (1D float) audio
                :param sampling_rate: sample rate
                :param chunk_length_s: độ dài 1 chunk (giây)
                :return: full transcription
                """
        chunk_size = chunk_length_s * sampling_rate
        texts = []
        predicted_ids = []
        all_logits = []
        for start in range(0, len(speech_array), chunk_size):
            chunk = speech_array[start:start + chunk_size]
            if len(chunk) == 0:
                continue
            text, chunk_predicted_ids, logits = await self._get_text_chunk(chunk, sampling_rate=sampling_rate)
            texts.append(text.strip())
            predicted_ids.append(chunk_predicted_ids)
            all_logits.append(logits)

        merged_predicted_ids = torch.cat(predicted_ids, dim=-1) if predicted_ids else torch.tensor([], dtype=torch.long)
        merged_logits = torch.cat(all_logits, dim=1) if all_logits else torch.empty((0, 0, 0))
        return " ".join(texts), merged_predicted_ids, merged_logits

    async def generate_vtt(self, speech_array, output_path: str, saved=False):
        text, predicted_ids, logits = await self.get_text(speech_array)
        tokens = self.processor.tokenizer.convert_ids_to_tokens(predicted_ids[0].tolist())
        time_per_step = len(speech_array) / 16000 / logits.shape[1]
        timestamps = [i * time_per_step for i in range(len(tokens))]
        words = self._ctc_decode_with_timestamps(tokens, timestamps)

        groups = self._group_words(words, max_duration=3.0, max_words=8)
        lines = generate_vtt(groups, output_path, saved)
        return text, lines

    def _group_words(self, words, max_duration=2.5, max_words=7):
        """
        Gom các từ thành cụm để làm subtitle.
        """
        grouped = []
        buffer = []
        start_time, end_time = None, None
        for (w_start, w_end, text) in words:
            if not buffer:
                start_time = w_start
            buffer.append(text)
            end_time = w_end
            if (end_time - start_time >= max_duration) or (len(buffer) >= max_words):
                grouped.append((start_time, end_time, " ".join(buffer)))
                buffer = []
                start_time, end_time = None, None
        if buffer:
            grouped.append((start_time, end_time, " ".join(buffer)))
        return grouped

    def _ctc_decode_with_timestamps(self, tokens, timestamps):
        words = []
        current_word = ""
        start_time, end_time = None, None
        for i, (tok, ts) in enumerate(zip(tokens, timestamps)):
            if tok in ["<pad>", "<unk>", "<s>", "</s>"]:
                continue
            if tok == "|":
                if current_word:
                    words.append((start_time, end_time, current_word))
                    current_word = ""
                    start_time, end_time = None, None
                continue
            if not current_word or tok != current_word[-1]:
                if not current_word:
                    start_time = ts
                current_word += tok
                end_time = ts
        if current_word:
            words.append((start_time, end_time, current_word))
        return words
