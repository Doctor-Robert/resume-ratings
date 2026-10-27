from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app.auth import check_password, find_user, get_current_user, make_token
from app.database import get_db
from app.models import User
from app.schemas import LoginForm

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
