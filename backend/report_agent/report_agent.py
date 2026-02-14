from google import genai
from backend.report_agent.prompt import REPORT_EXTRACTION_PROMPT
from backend.utils.fix_llm_response import fix_llm_json
from dotenv import load_dotenv
import os

load_dotenv()  # Loads .env variables


class report_agent:

    @staticmethod
    def agent(text: str):

        client = genai.Client(
            api_key=os.getenv("GEMINI_API_KEY")
        )

        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=REPORT_EXTRACTION_PROMPT + text,
            config={
                "temperature": 0,
                "response_mime_type": "application/json"
            }
        )

        raw = response.text
        print(raw)
        return fix_llm_json(raw)



if __name__ == "__main__":
    report_agent.agent(
        """45 year old male John Doe.
        Complaining chest pain and shortness of breath.
        BP 140/90, pulse 88.
        Given aspirin 325 mg orally.
        Transported to hospital ED."""
    )
