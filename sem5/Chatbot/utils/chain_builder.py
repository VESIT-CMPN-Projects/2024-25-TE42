from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain_community.vectorstores import Chroma

def build_therapy_chain(vector_store: Chroma):
    llm = ChatGroq(
        temperature=0.3,
        model_name="mixtral-8x7b-32768",
    )

    # Custom prompt template with proper variables
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a professional therapy assistant. Use this context:
        
        {context}
        
        Chat History: {chat_history}
        Question: {question}"""),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{question}"),
    ])

    # Initialize memory with proper configuration
    memory = ConversationBufferMemory(
        memory_key="chat_history",
        return_messages=True,
        input_key="question",
        output_key="answer"
    )

    # Create conversation chain with proper configuration
    qa_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vector_store.as_retriever(),
        memory=memory,
        combine_docs_chain_kwargs={"prompt": prompt},
        return_source_documents=True,
        verbose=True
    )

    return qa_chain