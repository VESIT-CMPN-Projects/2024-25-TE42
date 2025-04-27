import pickle
import numpy as np
import tensorflow as tf
from transformers import AutoTokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
import re


# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")

# Load label mapping
LABEL_MAPPING = {
    0: "admiration", 1: "amusement", 2: "anger", 3: "annoyance", 4: "approval",
    5: "caring", 6: "confusion", 7: "curiosity", 8: "desire", 9: "disappointment",
    10: "disapproval", 11: "disgust", 12: "embarrassment", 13: "excitement",
    14: "fear", 15: "gratitude", 16: "grief", 17: "joy", 18: "love",
    19: "nervousness", 20: "optimism", 21: "pride", 22: "realization",
    23: "relief", 24: "remorse", 25: "sadness", 26: "surprise", 27: "neutral"
}

def load_model():
    """Load the GoEmotionsBERT model from pickle file."""
    with open("models/emotion_model.pkl", "rb") as f:
        return pickle.load(f)

def predict_emotion(text: str):
    """Predict the emotion labels for the given text."""
    
    # Clear TensorFlow session (fixes stale results)
    tf.keras.backend.clear_session()
    
    # Reload the model to get fresh predictions
    model = load_model()

    inputs = tokenizer(text, return_tensors="tf", padding="max_length", truncation=True, max_length=128)

    with tf.device('/GPU:0' if tf.config.list_physical_devices('GPU') else '/CPU:0'):
        outputs = model(inputs)

    logits = outputs.logits
    probabilities = tf.sigmoid(logits).numpy()[0]
    top_indices = np.argsort(probabilities)[-3:][::-1]  # Get top 3 predictions

    top_labels_and_scores = [(LABEL_MAPPING[i], float(probabilities[i])) for i in top_indices]

    return top_labels_and_scores



# -------------------------------------------------------------------------------------------------------


# Load LSTM model
def load_lstm_model():
    """Load the Sentiment Analysis LSTM model."""
    with open("models/lstm_model.pkl", "rb") as f:
        return pickle.load(f)

# Load Tokenizer
def load_tokenizer():
    """Load the tokenizer used during training."""
    with open("models/lstm_tokenizer.pkl", "rb") as f:
        return pickle.load(f)

# Load models once to avoid reloading
lstm_model = load_lstm_model()
word_tokenizer = load_tokenizer()

# Define max length (must match training configuration)
MAXLEN = 128

def preprocess_text(text: str):
    """Preprocess text: lowercasing, removing special characters, and tokenizing."""
    text = text.lower()  # Convert to lowercase
    text = re.sub(r"[^a-z0-9\s]", "", text)  # Remove special characters
    texts = [text]  # Ensure format compatibility with tokenizer

    predict_tokenized = word_tokenizer.texts_to_sequences(texts)
    predict_padded = pad_sequences(predict_tokenized, padding='post', maxlen=MAXLEN)

    return predict_padded

def predict_sentiment(text: str):
    """Predict the sentiment of a given text."""
    
    # Clear TensorFlow session to prevent stale predictions
    tf.keras.backend.clear_session()
    
    # Reload model for fresh predictions
    model = load_lstm_model()

    processed_text = preprocess_text(text)
    sentiment_score = model.predict(processed_text)[0][0]  # Extract score

    # Classify sentiment
    if sentiment_score < 0.35:
        sentiment_label = "Negative"
    elif sentiment_score < 0.75:
        sentiment_label = "Neutral"
    else:
        sentiment_label = "Positive"

    return {"sentiment_score": float(sentiment_score), "sentiment": sentiment_label}