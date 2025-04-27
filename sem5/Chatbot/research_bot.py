from fastapi import FastAPI
from pydantic import BaseModel
from groq import Groq
from scholarly import scholarly
import kaggle.api as kaggle_api
from kaggle.api.kaggle_api_extended import KaggleApi
# Initialize FastAPI
app = FastAPI()

# Load Groq API
client = Groq(
    api_key="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"
)

# Define request model
class QueryRequest(BaseModel):
    text: str  # Example: "AI in healthcare"

# Function to generate chatbot response
def generate_response(query_text):
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": query_text}],
        temperature=1,
        max_completion_tokens=1024,
        top_p=1,
        stream=False,
        stop=None,
    )
    return completion.choices[0].message.content

# Research Paper Fetching
def get_research_papers(query):
  search_query = scholarly.search_pubs(query)
  num_papers = 10
  papers = []
  for i, paper in enumerate(search_query):
      if i >= num_papers:
          break
      papers.append({
          "title": paper['bib']['title'],
          "author": paper['bib'].get('author', 'Unknown'),
          "link": paper.get('pub_url', 'N/A'),
          "pdf_Link": paper.get('eprint_url', 'N/A'),
        

      })

  print(papers)
  return list(papers)

# Kaggle Dataset Fetching
def get_kaggle_datasets(query: str):
    try:
        datasets = kaggle_api.dataset_list(search=query)
        return [
            {dataset.ref, 
             dataset.title, 
             dataset.size,
             dataset.lastUpdated,
             } for dataset in datasets[:10]]  # Limit to 10 datasets
    except Exception as e:
        return [f"Error fetching datasets: {str(e)}"]


# Endpoint: Chat with AI
@app.post("/chat")
async def chat_with_bot(request: QueryRequest):
    query_text = request.text
    papers_list = get_research_papers(request.text)
    datasets = get_kaggle_datasets(request.text)
    response = generate_response(f"Provide insights on {query_text}.")
    return {"response": response, "papers": papers_list , "datasets": datasets}

# Endpoint: Get Research Papers
@app.post("/research_papers")
async def fetch_research_papers(request: QueryRequest):
    papers_list = get_research_papers(request.text)
    return {"papers": papers_list}

# Endpoint: Get Kaggle Datasets
@app.post("/kaggle_datasets")
async def fetch_kaggle_datasets(request: QueryRequest):
    datasets = get_kaggle_datasets(request.text)
    return {"datasets": datasets}

# Run the app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)