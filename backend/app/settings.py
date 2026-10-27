from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Все настройки читаются из переменных окружения (файл .env)."""

    postgres_user: str = "resume"
    postgres_password: str = "change-me"
    postgres_db: str = "resume"
    postgres_host: str = "db"

    secret_key: str = "change-me"
    openrouter_api_key: str = ""
    openrouter_model: str = "nvidia/nemotron-3-ultra-550b-a55b:free,poolside/laguna-s-2.1:free,google/gemma-4-31b-it:free"

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+psycopg://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}/{self.postgres_db}"
        )


settings = Settings()
