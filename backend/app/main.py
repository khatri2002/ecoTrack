from fastapi import FastAPI
from pydantic import BaseModel
from starlette.responses import JSONResponse
from .routers import user

app = FastAPI()

app.include_router(user.router, prefix="/user", tags=["user"])