from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "FlowMind AI API"
    app_version: str = "0.1.0"
    debug: bool = False

    # Base de données — SQLite en local, swap PostgreSQL par simple changement d'URL
    database_url: str = "sqlite+aiosqlite:///./flowmind.db"

    # Sécurité
    jwt_secret: str = "dev-secret-a-remplacer-en-production-32-bytes-min"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    refresh_token_expire_days: int = 7

    # CORS
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    model_config = SettingsConfigDict(env_file=".env", env_prefix="FLOWMIND_", extra="ignore")


settings = Settings()
