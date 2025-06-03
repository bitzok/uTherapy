import chromadb
from chromadb.config import Settings
from langchain.vectorstores import Chroma
import os
import pathlib

def get_vectorstore(persist_directory: str = None):
    if persist_directory is None:
        persist_directory = os.path.join(
        pathlib.Path(__file__).resolve().parents[2], 
            "database",
            "chroma_db"
        )
    
    client = chromadb.PersistentClient(
        path=persist_directory,
        settings=Settings(allow_reset=True)
    )
    return client

def get_langchain_chroma(embedding_function, persist_directory: str = None):
    if persist_directory is None:
        persist_directory = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            "database",
            "chroma_db"
        )
    
    return Chroma(
        persist_directory=persist_directory,
        embedding_function=embedding_function
    )