from fastapi import FastAPI

app = FastAPI(title="Оценка резюме")


@app.get("/api/health")
def health():
    return {"status": "ok"}
