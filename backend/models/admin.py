from pydantic import BaseModel
from typing import Annotated
from fastapi import Query

# admin sign in request

class adminSignIn(BaseModel):
    username: Annotated[str, Query(min_length=1)]
    password: Annotated[str, Query(min_length=1)]


# user dependency

class adminUser(BaseModel):
    id: int
    username: str

class TokenData(BaseModel):
    username: str | None = None
    role: str | None = None