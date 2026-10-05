from langchain_core.tools import tool
from pydantic import BaseModel, Field
from api.rag.embedder import embed_text
from api.rag.vector_store import retrieve_chunks
import google.generativeai as genai
import os
import json

genai.configure(api_key=os.environ.get("GEMINI_API_KEY", ""))
model = genai.GenerativeModel("models/gemini-3.8-flash")


class RetrieveInput(BaseModel):
    query: str = Field(description="Search query")
    doc_id: str = Field(description="Document ID")


@tool("retrieve_documents", args_schema=RetrieveInput)
async def retrieve_documents(query: str, doc_id: str) -> str:
    """Search uploaded legal documents for relevant passages. Use this to answer questions about document content."""
    emb = await embed_text(query)
    chunks = await retrieve_chunks(emb, top_k=5, namespace=doc_id)
    return json.dumps(chunks, ensure_ascii=False)


class ExtractInput(BaseModel):
    clause_type: str = Field(
        description="Clause type: termination, indemnity, liability, confidentiality, payment"
    )
    doc_id: str = Field(description="Document ID")


@tool("extract_clauses", args_schema=ExtractInput)
async def extract_clauses(clause_type: str, doc_id: str) -> str:
    """Extract specific types of legal clauses from the document."""
    emb = await embed_text(f"{clause_type} clause")
    chunks = await retrieve_chunks(emb, top_k=5, namespace=doc_id)

    prompt = f"""Extract all {clause_type} clauses from the following text.
Return as a JSON array with "text" and "section" fields.

Text:
{chr(10).join(c['text'] for c in chunks)}

JSON:"""
    response = model.generate_content(prompt)
    return response.text


class RiskInput(BaseModel):
    clause_text: str = Field(description="The clause text to analyze")


@tool("flag_risks", args_schema=RiskInput)
async def flag_risks(clause_text: str) -> str:
    """Analyze a clause for fairness. Returns risk level (LOW/MEDIUM/HIGH) and reason."""
    prompt = f"""Analyze this legal clause for fairness.
Return JSON: {{"risk": "LOW"|"MEDIUM"|"HIGH", "reason": "..."}}

Clause: "{clause_text}"

JSON:"""
    response = model.generate_content(prompt)
    return response.text


class CompareInput(BaseModel):
    doc_id_1: str = Field(description="First document ID")
    doc_id_2: str = Field(description="Second document ID")
    topic: str = Field(description="Topic to compare (e.g., termination)")


@tool("compare_documents", args_schema=CompareInput)
async def compare_documents(doc_id_1: str, doc_id_2: str, topic: str) -> str:
    """Compare two documents clause-by-clause on a specific topic."""
    emb = await embed_text(f"{topic} clause")

    chunks_1 = await retrieve_chunks(emb, top_k=3, namespace=doc_id_1)
    chunks_2 = await retrieve_chunks(emb, top_k=3, namespace=doc_id_2)

    prompt = f"""Compare the "{topic}" clauses from two documents.

Document 1:
{chr(10).join(c['text'] for c in chunks_1)}

Document 2:
{chr(10).join(c['text'] for c in chunks_2)}

Provide a side-by-side comparison and state which is more favorable and why."""
    response = model.generate_content(prompt)
    return response.text


class SummarizeInput(BaseModel):
    doc_id: str = Field(description="Document ID")
    section: str = Field(description="Section name or number")


@tool("summarize_section", args_schema=SummarizeInput)
async def summarize_section(doc_id: str, section: str) -> str:
    """Summarize a specific section of a document."""
    emb = await embed_text(f"Section {section}")
    chunks = await retrieve_chunks(emb, top_k=3, namespace=doc_id)

    prompt = f"""Summarize the "{section}" section in plain English.

Text:
{chr(10).join(c['text'] for c in chunks)}

Summary:"""
    response = model.generate_content(prompt)
    return response.text


tools = [
    retrieve_documents,
    extract_clauses,
    flag_risks,
    compare_documents,
    summarize_section
]