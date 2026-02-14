import json
import re

def fix_llm_json(text: str):
    """
    Attempts to repair malformed JSON from LLM output.
    Returns parsed dict if successful, else None.
    """

    if not text:
        return None

    # 1. Extract JSON block only
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        text = match.group()

    # 2. Normalize quotes
    text = text.replace("'", '"')

    # 3. Remove trailing commas
    text = re.sub(r",\s*([}\]])", r"\1", text)

    # 4. Remove unescaped newlines in strings
    text = re.sub(r'(?<!\\)\n', ' ', text)

    # 5. Attempt parse
    try:
        return json.loads(text)
    except Exception:
        return None
