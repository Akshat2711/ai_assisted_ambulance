from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from backend.report_agent.report_agent import report_agent

app = FastAPI()

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

report_agent_obj = report_agent()

class TextInput(BaseModel):
    text: str

@app.post("/report_create")
def report_create(data: TextInput):
    resp = report_agent_obj.agent(data.text)
    return resp
