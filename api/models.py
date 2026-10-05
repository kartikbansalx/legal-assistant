from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class QueryRequest(BaseModel):
    query: str
    doc_id: str
    mode: Optional[str] = "client"  # "lawyer" or "client"


class UploadResponse(BaseModel):
    doc_id: str
    name: str
    num_chunks: int
    num_pages: int
    summary: str


class AgentResponse(BaseModel):
    answer: str
    trace: List[Dict[str, Any]]
    citations: List[str]
    confidence: float
    risk_level: str