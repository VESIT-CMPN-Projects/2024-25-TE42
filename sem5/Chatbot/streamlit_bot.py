import streamlit as st
from groq import Groq
from textblob import TextBlob
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

# nltk.download('vader_lexicon')
sia = SentimentIntensityAnalyzer()

# Page configuration
st.set_page_config(
    page_title="Grok Chatbot",
    page_icon="💬",
    layout="wide"
)

# Custom CSS for a better chat UI
st.markdown("""
<style>
    
    
    /* Header styling */
    .chat-header {
        text-align: center;
        padding: 10px;
        margin-bottom: 20px;
        border-bottom: 1px solid #e0e0e0;
    }
    
    /* Chat container */
    
    
    /* Chat message bubbles */
    .chat-bubble {
        display: flex;
        max-width: 80%;
        padding: 10px 15px;
        border-radius: 18px;
        margin: 5px 0;
        word-wrap: break-word;
        line-height: 1.4;
    }
    
    /* User message styling */
    .user-container {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;
    }
    
    .user {
        background-color: #dcf8c6;
        color: #000000;
        border-bottom-right-radius: 5px;
        align-self: flex-end;
        margin-left: auto;
    }
    
    /* Assistant message styling */
    .assistant-container {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 10px;
    }
    
    .assistant {
        background-color: #ffffff;
        color: #000000;
        border-bottom-left-radius: 5px;
        align-self: flex-start;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
    
    /* Input area styling */
    .chat-input {
        display: flex;
        padding: 10px;
        background-color: white;
        border-radius: 24px;
        border: 1px solid #e0e0e0;
        margin-top: 10px;
    }
    
    /* Remove default Streamlit padding */
    .block-container {
        padding-top: 2rem !important;
        padding-bottom: 1rem !important;
    }

    /* Hide the Streamlit footer */
    footer {
        visibility: hidden;
    }
    
    /* Style Streamlit elements */
    .stTextInput > div > div > input {
        border-radius: 24px;
    }
    
    .stButton > button {
        border-radius: 24px;
        padding: 2px 15px;
        background-color: #4CAF50;
        color: white;
    }
</style>
""", unsafe_allow_html=True)

# JavaScript for handling Enter key press
st.markdown("""
<script>
document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.querySelector('.stTextInput input');
    const submitButton = document.querySelector('.stButton button');
    
    if (textInput && submitButton) {
        textInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitButton.click();
            }
        });
    }
});
</script>
""", unsafe_allow_html=True)

# App title in a chat-like header
st.markdown('<div class="chat-header"><h1>Grok Chatbot</h1><p>Ask me anything!</p></div>', unsafe_allow_html=True)

# Initialize Groq client
client = Groq(api_key="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")

# Chat history
if "messages" not in st.session_state:
    st.session_state.messages = []

# Function to determine response type based on sentiment, intent, mood, and emotions
def determine_response_type(query):
    sentiment_score = sia.polarity_scores(query)["compound"]
    blob = TextBlob(query)
    word_count = len(query.split())
    
    if sentiment_score > 0.5:
        mood = "Positive"
    elif sentiment_score < -0.5:
        mood = "Negative"
    else:
        mood = "Neutral"
    
    if "explain" in query.lower() or "detailed" in query.lower():
        return "Detailed"
    elif "steps" in query.lower() or "list" in query.lower():
        return "Bullet Points"
    elif "code" in query.lower() or "example" in query.lower():
        return "Code Snippet"
    elif word_count < 5:
        return "Concise"
    elif mood == "Negative":
        return "Empathetic"
    else:
        return "Default"

# Display chat container
st.markdown('<div class="chat-container" id="chat-container">', unsafe_allow_html=True)

# Display chat messages
for message in st.session_state.messages:
    if message["role"] == "user":
        st.markdown(f'<div class="user-container"><div class="chat-bubble user">{message["content"]}</div></div>', unsafe_allow_html=True)
    else:
        st.markdown(f'<div class="assistant-container"><div class="chat-bubble assistant">{message["content"]}</div></div>', unsafe_allow_html=True)

st.markdown('</div>', unsafe_allow_html=True)

# Create two columns for the input field and send button
col1, col2 = st.columns([5, 1])

with col1:
    # Use a key for the text input to handle Enter key properly in Streamlit
    user_input = st.text_input("", placeholder="Type your message here...", label_visibility="collapsed", key="chat_input")

with col2:
    send_button = st.button("Send")

# JavaScript to scroll to bottom of chat
st.markdown("""
<script>
    // Function to scroll to bottom of chat container
    function scrollToBottom() {
        const chatContainer = document.getElementById('chat-container');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }
    
    // Call the function when the page loads
    window.onload = scrollToBottom;
</script>
""", unsafe_allow_html=True)

# Process input either from the text field or the button
def process_input():
    if st.session_state.chat_input:
        user_input = st.session_state.chat_input
        
        # Determine response type dynamically
        selected_response_type = determine_response_type(user_input)
        
        # Store user message
        st.session_state.messages.append({"role": "user", "content": user_input})
        
        # Construct prompt template with full chat history
        conversation_history = "\n".join([f'{msg["role"].capitalize()}: {msg["content"]}' for msg in st.session_state.messages])
        prompt_template = f"""
        You are a helpful and empathetic mental health assistant. Your responses should match the user's emotional state and intent.  
        - If the user is seeking general information, keep responses between 50-100 words.  
        - If the user expresses distress or a mental health concern, respond with empathy first, then provide advice in about 200 words.  
        - Use {selected_response_type} formatting based on the user's message.  
        - at the end just ask a question

        Here is the conversation so far:
        {conversation_history}
        User query: {user_input}
        """
        
        # Create a placeholder for the streamed response
        message_placeholder = st.empty()
        
        # Get AI response from Groq
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt_template}],
            temperature=0.7,
            max_tokens=1024,
            top_p=1,
            stream=True,
        )
        
        ai_response = ""
        for chunk in completion:
            content = chunk.choices[0].delta.content or ""
            ai_response += content
            # Update the placeholder with the current response
            message_placeholder.markdown(f'<div class="assistant-container"><div class="chat-bubble assistant">{ai_response}</div></div>', unsafe_allow_html=True)
        
        # Store AI response
        st.session_state.messages.append({"role": "assistant", "content": ai_response})
        
        # Clear the input field
        st.session_state.chat_input = ""
        
        # Rerun to update the UI
        st.rerun()

# Check for button press
if send_button:
    process_input()

# Check for Enter key press using session state changes
if "previous_input" not in st.session_state:
    st.session_state.previous_input = ""

# If input changed and Enter was pressed (detected by comparing with previous value)
if st.session_state.chat_input != st.session_state.previous_input and st.session_state.chat_input and "\n" in st.session_state.chat_input:
    # Remove the newline character
    st.session_state.chat_input = st.session_state.chat_input.replace("\n", "")
    process_input()

# Update previous input
st.session_state.previous_input = st.session_state.chat_input

