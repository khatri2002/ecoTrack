from fastapi import Query
from pydantic import BaseModel, field_validator, EmailStr
from typing import Annotated
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

    @field_validator("email", mode="before")
    @classmethod
    def email_to_lower(cls, value: str) -> str:
        return value.lower()
    
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

class SignUpRequestOTP(UserSignUp):
    pass

class SignUpVerifyOTP(UserSignUp):
    otp: Annotated[str, Query(min_length=4, max_length=4, regex="^[0-9]{4}$")]


# user signIn request

class UserSignIn(BaseModel):
    email: EmailStr

    @field_validator("email", mode="before")
    @classmethod
    def email_to_lower(cls, value: str) -> str:
        return value.lower()

class SignInPassword(UserSignIn):
    password: str

class SignInRequestOTP(UserSignIn):
    pass

class SignInVerifyOTP(UserSignIn):
    otp: Annotated[str, Query(min_length=4, max_length=4, regex="^[0-9]{4}$")]


# user dependency

class User(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str

class TokenData(BaseModel):
    email: str | None = None


# report request data

class Coordinates(BaseModel):
    latitude: float
    longitude: float

class Location(BaseModel):
    city: str
    state: str
    address: str
    postal_code: str
    additional_address: str | None = None
    accurate_coordinates: Coordinates
    api_coordinates: Coordinates

class ReportRequestData(BaseModel):
    title: Annotated[str, Query(min_length=5, max_length=100)]
    description: Annotated[str, Query(min_length=10, max_length=500)]
    location: Location
