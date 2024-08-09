from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
from .routers import user

app = FastAPI()

class Demo(BaseModel):
    name: str

@app.get("/")
async def root(demo: Demo):
    return JSONResponse(status_code=200, content={"status": True})

app.include_router(user.router, prefix="/user", tags=["user"])