from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class QueryRequest(BaseModel):
    query: str
    doc_id: str
    doc_id_2: Optional[str] = None
    mode: Optional[str] = "client"  # "lawyer" or "client"


class UploadResponse(BaseModel):
    doc_id: str
    name: str
    num_chunks: int
    num_pages: int
    summary: str
    risk_heatmap: List[Dict[str, Any]]


class AgentResponse(BaseModel):
    answer: str
    trace: List[Dict[str, Any]]
    citations: List[str]
    confidence: float
    risk_level: str


class ClauseExtractRequest(BaseModel):
    doc_id: str
    clause_type: Optional[str] = "all"


class CompareRequest(BaseModel):
    doc_id_1: str
    doc_id_2: str
    topic: Optional[str] = "general"