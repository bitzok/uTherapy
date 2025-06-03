from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os

def process_pdf(file_path: str, chunk_size: int = 1000, chunk_overlap: int = 200):
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap
    )
    splits = text_splitter.split_documents(documents)
    return splits

def process_pdf_folder(folder_path: str = None):
    if folder_path is None:
        folder_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            "documents"
        )
    
    all_splits = []
    for filename in os.listdir(folder_path):
        if filename.endswith(".pdf"):
            file_path = os.path.join(folder_path, filename)
            splits = process_pdf(file_path)
            all_splits.extend(splits)
    return all_splits