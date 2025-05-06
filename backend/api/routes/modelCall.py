from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import requests

router = APIRouter()

from api.schemas.user import ChatMessage, ChatRequest

DEEPSEEK_API_URL = "https://openrouter.ai/api/v1/chat/completions"
DEEPSEEK_API_KEY = "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"
DEEPSEEK_MODEL = "deepseek/deepseek-r1:free"

@router.post("/chat/completions")
async def chat_with_deepseek(request: ChatRequest):
    # Headers requeridos por OpenRouter
    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "HTTP-Referer": "http://localhost:8000", 
        "X-Title": "uBot App",                   
        "Content-Type": "application/json"
    }
    
    # Preparar el payload para la API
    payload = {
        "model": DEEPSEEK_MODEL,
        "messages": [msg.dict() for msg in request.messages],
        "temperature": request.temperature
    }
    
    try:
        response = requests.post(
            DEEPSEEK_API_URL,
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
        # Manejar errores específicos de HTTP
        error_detail = f"Error from API: {e.response.text}"
        if e.response.status_code == 401:
            error_detail = "Invalid API key - Verifica tu clave de OpenRouter"
        elif e.response.status_code == 429:
            error_detail = "Límite de tasa excedido - Espera un momento"
        
        raise HTTPException(
            status_code=e.response.status_code,
            detail=error_detail
        )
        
    except requests.exceptions.RequestException as e:
        # Errores de conexión, timeout, etc.
        raise HTTPException(
            status_code=500,
            detail=f"Error de conexión: {str(e)}"
        )
        
    except Exception as e:
        # Cualquier otro error inesperado
        raise HTTPException(
            status_code=500,
            detail=f"Error interno: {str(e)}"
        )