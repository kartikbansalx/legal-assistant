# 🦉 LegalBuddy — AI Legal Assistant & Document Intelligence

<p align="center">
  <b>LegalBuddy</b> is an intelligent AI Legal Assistant powered by <b>RAG (Retrieval-Augmented Generation)</b>, <b>Gemini AI</b>, and <b>Agentic Multi-Step Reasoning</b>. It enables users to analyze contracts, ask natural-language questions, and receive instant explanations with exact source citations.
</p>

---

## 🌟 Key Features

1. **📄 Document Ingestion & Hybrid Vector RAG**:
   - Parses PDF, DOCX, and TXT contract files with automatic paragraph chunking and page indexing.
   - Performs hybrid vector search across legal context passages for high-precision retrieval.

2. **🧠 Agentic Multi-Step Reasoning Trace**:
   - Executes multi-step RAG tools (`retrieve_documents`, `analyze_clauses`).
   - Renders a **live reasoning trace** showing step-by-step tool execution, input parameters, and outputs.

3. **🎭 Dual-Mode Q&A (Lawyer vs. Client)**:
   - **Client Mode**: Translates complex legalese into clear, plain English summaries.
   - **Lawyer Mode**: Provides formal legal analysis referencing exact section numbers, obligations, and liabilities.

4. **⚡ 1-Click Pre-Loaded Demo Contracts**:
   - Includes pre-loaded contracts (*Mutual NDA*, *Senior Engineer Employment Agreement*, *Enterprise SaaS MSA*) for instant testing without requiring file uploads.

5. **🎯 Confidence Meter & Source Citations**:
   - Displays real-time confidence scores and section-level citations accompanying every response.

---

## 🏗️ Technical Architecture

```
┌────────────────────────────────────────────────────────┐
│               LegalBuddy React Frontend                │
│       Vite + Tailwind CSS + Lucide Icons (Clean UI)    │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│            Vercel Serverless API (FastAPI)             │
│   /api/health   /api/sample-docs  /api/upload  /api/agent
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │ Google Gemini API│
                  │ (LLM & Vector RAG│
                  └──────────────────┘
```

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- **Node.js**: v18+
- **Python**: 3.9 - 3.12 (Virtual Environment recommended)

### 2. Environment Configuration
Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Backend Setup (FastAPI)
```bash
# Activate your virtual environment
venv\Scripts\activate   # Windows
# source venv/bin/activate  # macOS / Linux

# Install Python requirements
pip install -r requirements.txt

# Start local FastAPI server
uvicorn api.index:app --reload --port 8000
```
Backend will run at: `http://localhost:8000`

### 4. Frontend Setup (React / Vite)
```bash
# In a new terminal window:
npm install

# Start Vite development server
npm run dev
```
Frontend will run at: `http://localhost:5173` (with `/api` proxied to port 8000).

---

## 🚀 Step-by-Step Vercel Deployment Guide

### Option 1: Deploying via Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy Project**:
   ```bash
   vercel
   ```
   Follow the CLI prompts (select current directory, accept project settings).

4. **Set Environment Variables on Vercel Dashboard**:
   - Go to your project on [vercel.com](https://vercel.com).
   - Navigate to **Settings -> Environment Variables**.
   - Add `GEMINI_API_KEY`.

5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploying via GitHub Integration

1. Push your repository to **GitHub**.
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Click **"Import Project"** and select your GitHub repository.
4. Framework Preset will be automatically detected as **Vite**.
5. Under **Environment Variables**, add `GEMINI_API_KEY`.
6. Click **Deploy**. Vercel will automatically build the frontend and host the Python serverless function at `/api/*`.

---

## 📦 Repository Structure

- `api/` — FastAPI Python backend (`index.py`, `models.py`, `sample_docs.py`, RAG retriever logic).
- `src/` — React frontend interface (`App.jsx`, `CleanHome.jsx`, `ChatAssistant.jsx`, `DocumentUpload.jsx`, `Navbar.jsx`, `FormattedText.jsx`).
- `public/` — Hero and mascot images (`hero.jpg`, `mascot.jpg`).
- `vercel.json` — Vercel serverless build & API rewrite configuration.
- `requirements.txt` — Python dependencies optimized for serverless deployment.
- `package.json` — Frontend dependencies.

---

## ⚖️ License & Disclaimer

LegalBuddy is designed for portfolio demonstration, contract review, and legal decision support. It does not constitute formal legal representation.

