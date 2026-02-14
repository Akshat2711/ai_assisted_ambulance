from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class TextInput(BaseModel):
    text: str

@app.post("/report_create")
def echo(data: TextInput):
    return {"received": data.text}
