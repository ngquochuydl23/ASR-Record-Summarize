from google import genai
from src.app.core.config import settings
from openai import OpenAI

class LLMService:
    def __init__(self, provider: str = "gemini"):
        self.gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.provider = provider

    def generate_text_gemini(self, prompt: str) -> str:
        response = self.gemini_client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
        return response.text

    def get_gemini_client(self):
        return self.gemini_client

    def embedding_text(self, text) -> list[float]:
        return self.openai_client.embeddings.create(
            input=[text.replace("\n", " ")],
            model=settings.OPENAI_EMBEDDING_MODEL).data[0].embedding

    def generate_title_conversation(self, msg_content: str) -> str:
        response = self.gemini_client.models.generate_content(
            model="gemini-2.0-flash",
            contents=f"""
                Based the starting message, generate title of conversation based on one.
                Max length: 30 characters
                Language is Vietnamese
                
                Message content is {msg_content}    
            """,
            config={
                "response_mime_type": "text/plain"
            },
        )
        return response.text.replace("\n", "")

