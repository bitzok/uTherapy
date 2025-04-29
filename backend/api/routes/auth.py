from fastapi import APIRouter, HTTPException
import re
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '../../core'))  # Ajusta ruta
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
import django
django.setup()

from users.models import user_profile
from api.schemas.user import EmailRequest, CodeVerification
from api.utils.email import generate_verification_code, send_verification_email

router = APIRouter()

@router.post("/register")
def register_user(request: EmailRequest):
    if not re.match(r"^[\w\.-]+@unmsm\.edu\.pe$", request.email):
        raise HTTPException(status_code=400, detail="Dominio no permitido")

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
    user.save()
    return {"msg": "Correo verificado con éxito"}
