# Основные команды проекта

up:  ## Собрать и запустить всё
	docker compose up -d --build

down:  ## Остановить
	docker compose down

migrate:  ## Применить миграции базы
	docker compose exec backend alembic upgrade head

# Пример: make create-user login=admin password=secret123
create-user:  ## Создать пользователя
	docker compose exec backend python -m app.create_user $(login) $(password)

logs:  ## Смотреть логи
	docker compose logs -f
