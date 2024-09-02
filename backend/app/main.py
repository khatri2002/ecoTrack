from fastapi import FastAPI
from .routers import user, admin

app = FastAPI()

app.include_router(user.router, prefix="/user", tags=["user"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])