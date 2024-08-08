from fastapi import Query
from pydantic import BaseModel, field_validator, EmailStr
from typing import Annotated, List
import re

# user signUp request

class UserSignUp(BaseModel):
    first_name: Annotated[str, Query(min_length=2, max_length=20, pattern="^[A-Za-z]+$")]
    last_name: Annotated[str, Query(min_length=2, max_length=20, pattern="^[A-Za-z]+$")]
    email: EmailStr
    phone: Annotated[str, Query(regex="^[0-9]{10}$")]
    password: Annotated[str, Query(min_length=8)]

    @field_validator("password")
    @classmethod
    def password_validator(cls, value: str) -> str:
        regex_checks = [
            {'regex': '[a-z]', 'message': 'Must contain at least one lowercase letter'},
            {'regex': '[A-Z]', 'message': 'Must contain at least one uppercase letter'},
            {'regex': '[0-9]', 'message': 'Must contain at least one number'},
            {'regex': '[^a-zA-Z0-9]', 'message': 'Must contain at least one special character'},
        ]
        for check in regex_checks:
            if not re.search(check['regex'], value):
                raise ValueError(check['message'])
        return value
    
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

class SignUpRequestOTP(UserSignUp):
    pass

class SignUpVerifyOTP(UserSignUp):
    otp: Annotated[str, Query(min_length=6, max_length=6, regex="^[0-9]{6}$")]


# user signIn request

class UserSignIn(BaseModel):
    email: EmailStr

class SignInPassword(UserSignIn):
    password: str

class SignInRequestOTP(UserSignIn):
    pass

class SignInVerifyOTP(UserSignIn):
    otp: Annotated[str, Query(min_length=6, max_length=6, regex="^[0-9]{6}$")]