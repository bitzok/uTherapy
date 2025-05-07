from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import requests
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

router = APIRouter()

from api.schemas.user import ChatMessage, ChatRequest

@router.post("/chat/completions")
async def chat_with_deepseek(request: ChatRequest):
    headers = {
        "Authorization": f"Bearer {os.getenv('DEEPSEEK_API_KEY')}",
        "HTTP-Referer": os.getenv("API_BASE_URL"),
        "X-Title": "uBot App",
        "Content-Type": "application/json"
    }

    payload = {
        "model": os.getenv("DEEPSEEK_MODEL"),
        "messages": [msg.dict() for msg in request.messages],
        "temperature": request.temperature
    }

    try:
        response = requests.post(
            os.getenv("DEEPSEEK_API_URL"),
            headers=headers,
            json=payload,
            timeout=30
        )

        response.raise_for_status()
        data = response.json()
        return {
            "choices": [{
                "message": data["choices"][0]["message"]
            }]
        }

    except requests.exceptions.HTTPError as e:
        error_detail = f"Error from API: {e.response.text}"
        if e.response.status_code == 401:
            error_detail = "Invalid API key - Verifica tu clave de OpenRouter"
        elif e.response.status_code == 429:
            error_detail = "Límite de tasa excedido - Espera un momento"
        raise HTTPException(status_code=e.response.status_code, detail=error_detail)

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error de conexión: {str(e)}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")
