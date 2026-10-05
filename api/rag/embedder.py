import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
genai.configure(api_key=os.environ["GEMINI_API_KEY"])


async def embed_text(text: str) -> list[float]:
    """
    Generate an embedding vector using Gemini text-embedding-004.
    Returns a 768-dimensional vector.
    """
    result = genai.embed_content(
        model="models/text-embedding-004",
        content=text,
        task_type="retrieval_document"
    )
    return result["embedding"]