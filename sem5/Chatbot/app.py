import streamlit as st
from utils.data_loader import load_and_vectorize_data
from utils.chain_builder import build_therapy_chain

# Initialize session state
if "messages" not in st.session_state:
    st.session_state.messages = []
if "chain" not in st.session_state:
    vector_store = load_and_vectorize_data("data/therapy_qa.csv")
    st.session_state.chain = build_therapy_chain(vector_store)

st.title("Therapy Assistant 🤖")

# Display chat history
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Handle user input
if prompt := st.chat_input("How are you feeling today?"):
    # Add user message to history
    st.session_state.messages.append({"role": "user", "content": prompt})
    
    with st.chat_message("user"):
        st.markdown(prompt)
    
    with st.chat_message("assistant"):
        # Get chain response
        response = st.session_state.chain({"question": prompt})
        
        # Format response with sources
        formatted_response = f"{response['answer']}\n\nSources: {', '.join(list(set([doc.metadata['source'] for doc in response['source_documents']])))}"
        st.markdown(formatted_response)
        st.session_state.messages.append({"role": "assistant", "content": formatted_response})