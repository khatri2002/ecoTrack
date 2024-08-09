from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
from .routers import user

app = FastAPI()


@app.get("/")
async def root():
    return JSONResponse(status_code=200, content={"status": True, "message": "Welcome to the API"})

app.include_router(user.router, prefix="/user", tags=["user"])