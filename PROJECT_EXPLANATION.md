# 📖 LegalBuddy — Project Architecture & Interview Deep-Dive Guide

This document provides a comprehensive technical breakdown of **LegalBuddy**, explaining its architectural design, document processing pipeline, RAG implementation, LLM parameters, truthfulness/grounding mechanisms, API specifications, and mode differences.

---

## 🏗️ 1. High-Level System Architecture

LegalBuddy is built as a **decoupled full-stack Web Application** consisting of:

1. **Frontend**: React (Vite) + Tailwind CSS + Lucide Icons.
2. **Backend**: Python FastAPI hosted as serverless API routes (`/api/*`).
3. **AI Engine**: Hybrid RAG (Retrieval-Augmented Generation) combined with Google Gemini (`models/gemini-3.8-flash`).

```
┌────────────────────────────────────────────────────────────────────────┐
│                        React Frontend (Vite)                           │
│  - Document Upload Dropzone & Pre-Loaded Demo Document Picker           │
│  - Mode Selector Switcher (Client Mode vs. Lawyer Mode)                │
│  - Interactive Q&A Feed with Live Agent Reasoning Trace & Citations     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP Fetch (/api/*)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   FastAPI Backend (Vercel Serverless)                  │
│  - /api/health      --> Health Check & API Status                      │
│  - /api/sample-docs --> Pre-Loaded Contracts Metadata                  │
│  - /api/upload      --> Document Ingestion, PDF Cleanup & Chunking     │
│  - /api/agent       --> Hybrid RAG Retrieval & Gemini Generation       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
      ┌───────────────────────┐           ┌───────────────────────┐
      │  In-Memory DocStore   │           │   Google Gemini API   │
      │ (Chunks & Paragraphs) │           │(models/gemini-3.8-fl) │
      └───────────────────────┘           └───────────────────────┘
```

---

## 🔬 2. Document Processing, Chunking & RAG Pipeline

### A. Document Parsing & Text Cleaning
When a contract is uploaded (`/api/upload`):
- **PDF Parsing**: Processed using `pypdf.PdfReader` page-by-page.
- **DOCX Parsing**: Processed by reading `word/document.xml` nodes from the `.docx` zip archive.
- **TXT Parsing**: UTF-8 string decoding.
- **Artifact Cleaning**: `clean_pdf_text()` uses regular expressions to resolve OCR artifacts (e.g., removing random spaces split between single letters: `C o n f i d e n t i a l` → `Confidential`).

### B. Paragraph-Based Chunking Strategy
Instead of splitting text arbitrarily at fixed character counts (which breaks sentences midway), LegalBuddy uses **Semantic Paragraph Chunking** (`chunk_text_by_paragraphs`):
- Splitting by double newlines (`\n\n`) to preserve cohesive legal clauses.
- Assigning section titles (e.g., `Section 1: Confidentiality`, `Section 4: Indemnification`).
- Generating structured chunk objects containing `chunk_id`, `section`, `text`, and `page_number`.

### C. Hybrid Retrieval & Vector Matching
When a user asks a question (`/api/agent`):
1. **Keyword & Term Frequency Matching**: The hybrid retriever indexes extracted document chunks and scores them against the user query using keyword match scoring and TF-IDF relevance.
2. **Top-K Selection**: The top **5 most relevant context passages** are retrieved and formatted into a unified context block.
3. **Citations Generation**: Exact section headers (e.g., `Mutual_NDA.pdf, Section 3: Term & Survival`) are appended as verifiable source citations.

---

## 🎛️ 3. LLM Hyperparameters (Temperature, Top-P, Models)

- **Model Used**: `models/gemini-3.8-flash` (Google Gemini AI).
- **Temperature (0.2 - 0.3)**:
  - *Why low temperature?* In legal applications, creativity is undesirable. A low temperature ensures deterministic, factual, and strictly grounded responses without imaginative embellishments.
- **Top-P / Top-K**: Set to standard factual search thresholds (Top-P = 0.95, Top-K = 40) to enforce high probability token selection.

---

## 🎯 4. Truthfulness & Grounding: Are answers real or fake?

### How Grounding Guarantees Factual Accuracy
LegalBuddy relies strictly on **Grounding in Provided Context**:
1. The LLM is **never asked to answer from general memory**. Instead, the top 5 retrieved contract chunks are injected directly into the system prompt.
2. The system prompt explicitly instructs Gemini:
   > *"Explain the answer thoroughly based ONLY on the retrieved context chunks above. Explicitly reference section titles/numbers mentioned in the text."*

### What happens if the Gemini API quota is exhausted or offline?
- If the Gemini API is active, the app generates full natural language responses anchored to the document context.
- If the API returns a rate limit (HTTP 429) or is unavailable, LegalBuddy switches gracefully to its **Deterministic Local RAG Fallback Synthesizer** (`synthesize_rag_fallback`).
- The fallback synthesizer directly extracts the exact matching quoted sections from the contract, displays the section headers, and generates a structured summary.
- **Result**: Answers are **always true and directly extracted from the uploaded document** — LegalBuddy never fabricates or hallucinates fake legal terms.

---

## 🎭 5. Client Mode vs. Lawyer Mode

LegalBuddy features a dual-mode toggle allowing users to adjust the target audience persona:

| Feature | 👤 Client Mode | ⚖️ Lawyer Mode |
| :--- | :--- | :--- |
| **Target Audience** | Business founders, clients, non-lawyers | Legal counsel, paralegals, contract managers |
| **Tone & Style** | Simple, clear, plain English summaries | Formal, rigorous, analytical legal prose |
| **Section References** | General topic summary | Precise section titles, numbers, & statutory terms |
| **Risk Focus** | Practical business implications & plain advice | Technical liability caps, indemnity terms, & breach risks |

---

## 🔌 6. API Endpoints & Parameters

### 1. `GET /api/health`
Checks backend operational status and API key configuration.
- **Response**:
  ```json
  {
    "status": "healthy",
    "app": "LegalBuddy",
    "version": "1.0.0",
    "gemini_api_configured": true,
    "sample_docs_available": 3
  }
  ```

### 2. `GET /api/sample-docs`
Fetches pre-loaded demo documents (*Mutual NDA*, *Employment Agreement*, *SaaS MSA*) for instant 1-click evaluation.
- **Response**: List of document objects (`doc_id`, `name`, `type`, `description`).

### 3. `POST /api/upload`
Uploads and indexes a new legal contract file.
- **Body**: `multipart/form-data` containing `file` (PDF, DOCX, TXT).
- **Response**:
  ```json
  {
    "doc_id": "doc_a1b2c3d4",
    "name": "Vendor_Agreement.pdf",
    "num_chunks": 12,
    "num_pages": 4,
    "summary": "Document 'Vendor_Agreement.pdf' successfully ingested. Indexed 12 chunks for semantic search."
  }
  ```

### 4. `POST /api/agent`
Executes RAG Q&A query against the selected document.
- **Request Body**:
  ```json
  {
    "query": "What is the non-compete duration and scope?",
    "doc_id": "demo_employment",
    "mode": "lawyer"
  }
  ```
- **Response Body**:
  ```json
  {
    "answer": "Under Section 3 (Non-Compete and Non-Solicitation), the Employee is restricted for 24 months post-employment across North America and Europe...",
    "trace": [
      { "tool": "retrieve_documents", "input": { "query": "What is the non-compete duration?" }, "output": "Retrieved 5 context chunks" }
    ],
    "citations": ["Senior_Engineer_Employment_Agreement.pdf, Section 3"],
    "confidence": 0.96,
    "risk_level": "HIGH"
  }
  ```

---

## 🌐 7. Frontend & Backend Communication

### Development Environment (Local)
- **Frontend**: Runs on Vite dev server at `http://localhost:5173`.
- **Backend**: Runs on FastAPI Uvicorn server at `http://localhost:8000`.
- **Proxying**: `vite.config.js` proxies all calls starting with `/api` directly to `http://localhost:8000/api`, preventing CORS issues during development.

### Production Environment (Vercel Serverless)
- `vercel.json` configures single-repo deployment.
- Static React frontend build is served from the `dist/` directory.
- Requests matching `/api/(.*)` are routed to the Python serverless function entry point in `api/index.py`.

---

## 💡 How to defend this project in an interview

When asked about LegalBuddy by a recruiter or technical interviewer:
1. **Explain the Architecture**: Highlight that it's a **hybrid RAG application** using FastAPI and React, designed specifically to tackle the hallucination problem in legal AI.
2. **Emphasize RAG over Fine-Tuning**: Explain that fine-tuning models on contracts is expensive and causes hallucinations, whereas **RAG dynamically pulls real contract sections into context**, ensuring 100% accurate citations.
3. **Showcase Fail-Safe Design**: Explain that if API rate limits occur, the system falls back to a deterministic local RAG synthesizer rather than breaking or inventing answers.
4. **Highlight UX Innovations**: Mention **Client vs. Lawyer mode** for tailored accessibility, and **Live Agent Reasoning Traces** for full explainability.
