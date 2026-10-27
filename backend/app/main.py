from fastapi import FastAPI

from app.routes import router

app = FastAPI(title="Оценка резюме")
app.include_router(router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
