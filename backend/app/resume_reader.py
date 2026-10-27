from io import BytesIO

from docx import Document
from fastapi import HTTPException
from pypdf import PdfReader


def read_resume_file(filename: str, content: bytes) -> str:
    """Достаёт текст из PDF или DOCX."""
    name = filename.lower()
    try:
        if name.endswith(".pdf"):
            pages = PdfReader(BytesIO(content)).pages
            text = "\n".join(page.extract_text() or "" for page in pages)
        elif name.endswith(".docx"):
            text = "\n".join(p.text for p in Document(BytesIO(content)).paragraphs)
        else:
            raise HTTPException(status_code=400, detail="Поддерживаются только PDF и DOCX")
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=400, detail="Не удалось прочитать файл")

    if not text.strip():
        raise HTTPException(status_code=400, detail="В файле не найден текст")
    return text
