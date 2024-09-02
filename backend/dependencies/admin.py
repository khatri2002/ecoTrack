from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated
from jwt.exceptions import InvalidTokenError

from models.admin import TokenData
from app.utils import decode_access_token
from app.db import admin_user_collection

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_admin_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_access_token(token)
        username: str = payload.get("username")
        role: str = payload.get("role")
        if not username or role != "admin":
            raise credentials_exception
        token_data = TokenData(username=username, role=role)
    except InvalidTokenError:
        raise credentials_exception

    try:
        admin = await admin_user_collection.find_one({"username": token_data.username}, {"_id": 0, "password": 0})
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    if admin is None:
        raise credentials_exception
    return admin