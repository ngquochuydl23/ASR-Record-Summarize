from pydantic import BaseModel, Field


class TranscriptionDto(BaseModel):
    text: str = Field(..., example="Sau khi hôn các cô gái sẽ có những phản ứng...")