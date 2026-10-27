"""Создание пользователя из консоли: python -m app.create_user <логин> <пароль>"""
import sys

from app.auth import find_user, hash_password
from app.database import SessionLocal
from app.models import User


def main():
    if len(sys.argv) != 3:
        sys.exit("Использование: python -m app.create_user <логин> <пароль>")
    username, password = sys.argv[1], sys.argv[2]

    with SessionLocal() as db:
        if find_user(db, username):
            sys.exit(f"Пользователь {username} уже есть")
        db.add(User(username=username, password_hash=hash_password(password)))
        db.commit()
    print(f"Пользователь {username} создан")


if __name__ == "__main__":
    main()
