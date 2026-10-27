from datetime import datetime

from pydantic import BaseModel, Field


class LoginForm(BaseModel):
    username: str
    password: str


class AiAnswer(BaseModel):
    """Какой JSON должна вернуть нейросеть. Всё остальное считается ошибкой."""

    score: int = Field(ge=0, le=100)
    strengths: list[str]
    gaps: list[str]


class EvaluationOut(AiAnswer):
    id: int
    vacancy_title: str
    vacancy_text: str
    resume_text: str
    created_at: datetime

    model_config = {"from_attributes": True}
