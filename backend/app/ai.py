import json

import httpx
from fastapi import HTTPException
from pydantic import ValidationError

from app.schemas import AiAnswer
from app.settings import settings

PROMPT = """Ты — помощник HR. Сравни резюме кандидата с вакансией.
Верни ТОЛЬКО JSON без пояснений и без markdown, в таком виде:
{{"score": число от 0 до 100 (процент соответствия), "strengths": ["сильная сторона", ...], "gaps": ["чего не хватает", ...]}}
Пиши на русском языке.

ВАКАНСИЯ:
{vacancy}

РЕЗЮМЕ:
{resume}
"""


def evaluate(vacancy: str, resume: str) -> AiAnswer:
    """Отправляет вакансию и резюме в LLM и проверяет, что ответ — правильный JSON."""
    if not settings.openrouter_api_key:
        raise HTTPException(status_code=500, detail="Не задан ключ OPENROUTER_API_KEY")

    # Бесплатные модели иногда перегружены, поэтому в OPENROUTER_MODEL можно указать
    # несколько через запятую: пробуем по очереди, пока одна не ответит
    text = None
    for model in settings.openrouter_model.split(","):
        try:
            response = httpx.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={"Authorization": f"Bearer {settings.openrouter_api_key}"},
                json={
                    "model": model.strip(),
                    "messages": [{"role": "user", "content": PROMPT.format(vacancy=vacancy, resume=resume)}],
                },
                timeout=120,
            )
            response.raise_for_status()
            text = response.json()["choices"][0]["message"]["content"]
            if text:
                break
        except (httpx.HTTPError, KeyError, IndexError, ValueError, TypeError):
            continue
    if not text:
        raise HTTPException(status_code=502, detail="Не удалось получить ответ от нейросети, попробуйте ещё раз")

    try:
        # Модель иногда оборачивает JSON в лишний текст — берём то, что между { и }
        return AiAnswer.model_validate(json.loads(text[text.index("{") : text.rindex("}") + 1]))
    except (ValueError, ValidationError):
        raise HTTPException(status_code=502, detail="Нейросеть вернула ответ в неправильном формате")
