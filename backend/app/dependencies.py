from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated
from jwt.exceptions import InvalidTokenError

from app.models import TokenData
from app.utils import decode_access_token
from app.db import user_collection

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_access_token(token)
        email: str = payload.get("email")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except InvalidTokenError:
        raise credentials_exception

    try:
        user = await user_collection.find_one({"email": token_data.email}, {"_id": 0, "password": 0})
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    if user is None:
        raise credentials_exception
    return user