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

    
class ChatMessage(BaseModel):
    role: str  # "system", "user" o "assistant"
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    temperature: Optional[float] = 0.7
