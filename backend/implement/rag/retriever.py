from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor
from langchain.chat_models import ChatOpenAI
from langchain.vectorstores import Chroma
import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))
persist_directory = os.path.join(BASE_DIR, "database", "chroma_db")

def get_retriever(vectorstore, embedding_model, k=5):
    db = Chroma.from_documents(
        documents=vectorstore,
        embedding=embedding_model,
        persist_directory=persist_directory
    )
    
    llm = ChatOpenAI(temperature=0) 
    compressor = LLMChainExtractor.from_llm(llm)
    compression_retriever = ContextualCompressionRetriever(
        base_compressor=compressor,
        base_retriever=db.as_retriever(search_kwargs={"k": k})
    )
    
    return compression_retriever