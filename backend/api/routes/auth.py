from fastapi import APIRouter, HTTPException
import re
import sys
import os
from api.schemas.user import RegisterPasswordSecure
from api.schemas.user import EmailRequest, CodeVerification
from api.schemas.user import LoginRequest, TokenResponse

sys.path.append(os.path.join(os.path.dirname(__file__), '../../core'))  # Ajusta ruta
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
import django
django.setup()

from users.models import user_profile
from api.utils.email import generate_verification_code, send_verification_email
from api.utils.token import verify_temp_token
from api.utils.token import create_temp_token
from api.utils.security import hash_password
from api.utils.token import create_access_token
from api.utils.security import verify_password


router = APIRouter()

@router.post("/register")
def register_user(request: EmailRequest):
    # if not re.match(r"^[\w\.-]+@unmsm\.edu\.pe$", request.email):
    #     raise HTTPException(status_code=400, detail="Dominio no permitido")

    code = generate_verification_code()
    send_verification_email(request.email, code)

    user, _ = user_profile.objects.update_or_create(
        email=request.email,
        defaults={"verification_code": code}
    )

    return {"msg": "Código de verificación enviado"}

@router.post("/verify")
def verify_code(request: CodeVerification):
    try:
        user = user_profile.objects.get(email=request.email)
    except user_profile.DoesNotExist:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if user.verification_code != request.code:
        raise HTTPException(status_code=400, detail="Código incorrecto")

    user.is_verified = True
    user.verification_code = None  # opcional: limpiar código
    user.save()

    # Generar token temporal
    token = create_temp_token(user.email)

    return {
        "msg": "Correo verificado correctamente",
        "token": token,
        "expires_in_minutes": 10
    }

@router.post("/register/password")
def register_password(data: RegisterPasswordSecure):
    email = verify_temp_token(data.token)
    if not email:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

    try:
        user = user_profile.objects.get(email=email)
    except user_profile.DoesNotExist:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Correo no verificado")

    if user.password_hash:
        raise HTTPException(status_code=400, detail="Contraseña ya registrada")

    user.password_hash = hash_password(data.password)
    user.save()

    return {"msg": "Contraseña registrada correctamente"}

@router.post("/login", response_model=TokenResponse)
def login_user(data: LoginRequest):
    try:
        user = user_profile.objects.get(email=data.email)
    except user_profile.DoesNotExist:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Correo no verificado")

    if not user.password_hash:
        raise HTTPException(status_code=400, detail="Usuario no tiene contraseña registrada")

    if not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")

    token = create_access_token(user.email)

    return {
        "access_token": token,
        "token_type": "bearer"
    }