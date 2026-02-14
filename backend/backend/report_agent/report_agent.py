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
        """Male approx 32 years, RTA bike skid around 14:20. Patient conscious but incoherent initially, later coherent. Complains of left leg pain 7/10. No known medical history.

Airway patent. O2 via NRB mask started. Radial pulse present.
Skin moist/clammy, color pale. Respirations wet. Pupils equal reactive.

Vitals:
14:25 — BP 140/90, Pulse 102 rapid, RR 22, SpO2 94%, BGL 110.
14:40 — BP 136/88, Pulse 96, RR 20, SpO2 96%.

LOC for about 2 minutes reported by bystander.

Medication:
14:30 — Inj Diclofenac IM, pain reduced.

Transferred ALS ground to City Hospital ED.
EMS provider signed 14:55."""
    )
