import os
import random
from dotenv import load_dotenv
import resend

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")

def generate_verification_code():
    return str(random.randint(100000, 999999))

def send_verification_email(email, code):
    subject = "Código de verificación para uTherapy"
    html = f"""
    <div style="font-family: sans-serif; padding: 20px;">
        <h2>¡Hola!</h2>
        <p>Tu código de verificación es:</p>
        <h1 style="background: #FF804C; color: white; padding: 10px; border-radius: 8px; display: inline-block;">{code}</h1>
        <p>Ingresa este código en la app para verificar tu correo.</p>
        <p style="font-size: 12px; color: gray;">Este mensaje fue enviado desde uTherapy App.</p>
    </div>
    """

    resend.Emails.send({
        "from": os.getenv("EMAIL_FROM"),
        "to": [email],
        "subject": subject,
        "html": html
    })
