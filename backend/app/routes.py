from fastapi import APIRouter, Depends, File, Form, HTTPException, Response, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.ai import evaluate
from app.auth import check_password, find_user, get_current_user, make_token
from app.database import get_db
from app.models import Evaluation, User
from app.resume_reader import read_resume_file
from app.schemas import EvaluationOut, LoginForm

router = APIRouter(prefix="/api")


@router.post("/login")
def login(form: LoginForm, response: Response, db: Session = Depends(get_db)):
    user = find_user(db, form.username)
    if user is None or not check_password(form.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")
    response.set_cookie("token", make_token(user.id), httponly=True, samesite="lax", max_age=7 * 24 * 3600)
    return {"username": user.username}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("token")
    return {"ok": True}


@router.get("/me")
def me(user: User = Depends(get_current_user)):
    return {"username": user.username}


@router.post("/evaluations", response_model=EvaluationOut)
def create_evaluation(
    vacancy_title: str = Form(),
    resume_text: str = Form(default=""),
    resume_file: UploadFile | None = File(default=None),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if resume_file is not None and resume_file.filename:
        resume = read_resume_file(resume_file.filename, resume_file.file.read())
    else:
        resume = resume_text
    if not vacancy_title.strip() or not resume.strip():
        raise HTTPException(status_code=400, detail="Нужны название вакансии и резюме")

    answer = evaluate(vacancy_title, resume)
    evaluation = Evaluation(
        user_id=user.id,
        vacancy_title=vacancy_title.strip(),
        resume_text=resume,
        score=answer.score,
        strengths=answer.strengths,
        gaps=answer.gaps,
    )
    db.add(evaluation)
    db.commit()
    db.refresh(evaluation)
    return evaluation


@router.get("/evaluations", response_model=list[EvaluationOut])
def list_evaluations(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    query = select(Evaluation).where(Evaluation.user_id == user.id).order_by(Evaluation.id.desc())
    return db.scalars(query).all()


@router.get("/evaluations/{evaluation_id}", response_model=EvaluationOut)
def get_evaluation(evaluation_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    evaluation = db.get(Evaluation, evaluation_id)
    if evaluation is None or evaluation.user_id != user.id:
        raise HTTPException(status_code=404, detail="Оценка не найдена")
    return evaluation
