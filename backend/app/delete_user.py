"""Удаление пользователя из консоли: python -m app.delete_user <логин>"""
import sys

from sqlalchemy import delete

from app.auth import find_user
from app.database import SessionLocal
from app.models import Evaluation, User


def main():
    if len(sys.argv) != 2:
        sys.exit("Использование: python -m app.delete_user <логин>")
    username = sys.argv[1]

    with SessionLocal() as db:
        user = find_user(db, username)
        if user is None:
            sys.exit(f"Пользователя {username} нет")
        # Сначала удаляем его оценки, потом самого пользователя
        db.execute(delete(Evaluation).where(Evaluation.user_id == user.id))
        db.delete(user)
        db.commit()
    print(f"Пользователь {username} и его оценки удалены")


if __name__ == "__main__":
    main()
