from fastapi import FastAPI
from pydantic import BaseModel
from models.utils import predict_emotion
from models.utils import predict_sentiment

app = FastAPI()

# Define request body
class TextRequest(BaseModel):
    text: str

@app.post("/predict")
async def get_emotion_prediction(request: TextRequest):
    """API Endpoint to predict emotions from text."""
    result = predict_emotion(request.text)
    return {"predictions": result}

@app.post("/predict-sentiment")
async def get_sentiment_prediction(request: TextRequest):
    """API Endpoint to predict sentiment from text."""
    result = predict_sentiment(request.text)
    return result

# Run with: uvicorn app:app --reload
