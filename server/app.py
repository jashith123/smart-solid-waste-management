from fastapi import FastAPI

from routers.detect import router as detect_router

from routers.report import router as report_router

from fastapi.staticfiles import StaticFiles

from config import UPLOADS_DIR


app = FastAPI()

app.mount(
    "/uploads",
    StaticFiles(directory=str(UPLOADS_DIR)),
    name="uploads"
)

@app.get("/")
def root():
    return {
        "message": "Garbage Detection API Running"
    }


app.include_router(
    detect_router
)

app.include_router(
    report_router
)

