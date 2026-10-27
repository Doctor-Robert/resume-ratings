from datetime import datetime, timedelta, timezone

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from fastapi import Cookie, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.settings import settings

hasher = PasswordHasher()


def hash_password(password: str) -> str:
    return hasher.hash(password)


def check_password(password: str, password_hash: str) -> bool:
    try:
        return hasher.verify(password_hash, password)
    except VerifyMismatchError:
        return False


def make_token(user_id: int) -> str:
    """Токен — подписанная запись «этот пользователь вошёл», живёт 7 дней."""
    expires = datetime.now(timezone.utc) + timedelta(days=7)
    return jwt.encode({"sub": str(user_id), "exp": expires}, settings.secret_key, algorithm="HS256")


def get_current_user(token: str | None = Cookie(default=None), db: Session = Depends(get_db)) -> User:
    """Проверка «кто ты»: без входа любой защищённый адрес отвечает 401."""
    if token is None:
        raise HTTPException(status_code=401, detail="Нужно войти")
    try:
        data = jwt.decode(token, settings.secret_key, algorithms=["HS256"])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Нужно войти")
    user = db.get(User, int(data["sub"]))
    if user is None:
        raise HTTPException(status_code=401, detail="Нужно войти")
    return user


def find_user(db: Session, username: str) -> User | None:
    return db.scalar(select(User).where(User.username == username))
