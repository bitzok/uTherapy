from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import requests
import os
import sys
from dotenv import load_dotenv
from implement.rag.retriever import get_retriever
from implement.rag.embeddings import get_embedding_model
from implement.rag.pdf_processor import process_pdf, process_pdf_folder
from implement.rag.vectorstore import get_vectorstore
from langchain.vectorstores import Chroma
from pathlib import Path
from api.schemas.user import ChatMessage, ChatRequest

load_dotenv()

backend_path = Path(__file__).resolve().parent.parent.parent
implement_path = backend_path / "implement"
documents_path = implement_path / "documents"

from tempfile import NamedTemporaryFile

router = APIRouter()

embedding_model = get_embedding_model()
vectorstore_client = get_vectorstore()

initial_docs_loaded = False

if documents_path.exists() and not initial_docs_loaded:
    try:
        documents = process_pdf_folder(str(documents_path))
        vectorstore = Chroma.from_documents(
            documents=documents,
            embedding=embedding_model,
            client=vectorstore_client,
            collection_name="knowledge_base",
            persist_directory=str(backend_path/ "database" / "chroma_db")
        )
        initial_docs_loaded = True
    except Exception as e:
        print(f"Error loading initial documents: {str(e)}")

@router.post("/chat/completions")
async def chat_with_deepseek(request: ChatRequest):
    if initial_docs_loaded:
        db = Chroma(
            client=vectorstore_client,
            collection_name="knowledge_base",
            embedding_function=embedding_model,
            persist_directory=str(backend_path/ "database" / "chroma_db")
        )
        last_message = request.messages[-1].content
        docs = db.similarity_search(last_message, k=3)
        context = "\n\n".join([doc.page_content for doc in docs])
        
        augmented_message = f"Contexto:\n{context}\n\nPregunta: {last_message}"
        request.messages[-1].content = augmented_message
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
