import os
import docx
import re
from PyPDF2 import PdfReader


def normalize_text(text: str) -> str:
    text = re.sub(r'(?<!\n)\n(?!\n)', ' ', text)
    text = re.sub(r'\n{2,}', '\n', text)
    return text.strip()

def extract_text_from_pdf(path: str) -> str:
    reader = PdfReader(path)
    raw_text = " ".join([page.extract_text() for page in reader.pages if page.extract_text()])
    return normalize_text(raw_text)

def extract_text_from_docx(path: str) -> str:
    doc = docx.Document(path)
    raw_text = " ".join([para.text for para in doc.paragraphs if para.text.strip()])
    return normalize_text(raw_text)

def extract_text(path: str) -> str:
    ext = os.path.splitext(path)[1].lower()
    if ext == ".pdf":
        return extract_text_from_pdf(path)
    elif ext == ".docx":
        return extract_text_from_docx(path)
    else:
        raise ValueError(f"Unsupported file type: {ext}")