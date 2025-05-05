from jose import jwt, JWTError
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()
SECRET_KEY = os.getenv("JWT_SECRET", "clave_dev_temporal")
ALGORITHM = "HS256"

def create_temp_token(email: str, minutes: int = 10):
    expire = datetime.utcnow() + timedelta(minutes=minutes)
    to_encode = {"sub": email, "exp": expire}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_temp_token(token: str) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None

def create_access_token(email: str, minutes: int = 60):
    expire = datetime.utcnow() + timedelta(minutes=minutes)
    to_encode = {"sub": email, "exp": expire}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)