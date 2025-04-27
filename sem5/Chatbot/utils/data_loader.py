import pandas as pd
from langchain_community.document_loaders import CSVLoader
from langchain_community.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings  # Changed from OpenAIEmbeddings

def load_and_vectorize_data(file_path):
    loader = CSVLoader(file_path=file_path, source_column="question")
    documents = loader.load()
    
    # Using open-source embeddings
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    
    vector_store = Chroma.from_documents(
        documents=documents,
        embedding=embeddings,
        persist_directory="./chroma_db"
    )
    return vector_store