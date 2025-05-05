from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr

class EmailRequest(BaseModel):
    email: EmailStr

class CodeVerification(BaseModel):
    email: EmailStr
    code: str

class RegisterPasswordSecure(BaseModel):
    token: str  # JWT temporal
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"