# 🦉 LegalBuddy — AI Legal Assistant & Contract Auditor



<p align="center">
  <b>LegalBuddy</b> is an intelligent AI Legal Assistant powered by <b>RAG (Retrieval-Augmented Generation)</b>, <b>LangGraph Multi-Step Agentic Reasoning</b>, <b>Clause Extraction</b>, <b>Visual Risk Heatmaps</b>, and <b>Side-by-Side Contract Comparison</b>.
</p>

---

## 🌟 Key Features

1. **📄 Document Ingestion & Vector RAG**:
   - Parses PDF, DOCX, and TXT files with paragraph & page tracking.
   - Embeds document chunks using Gemini `text-embedding-004` and indexes them into Pinecone vector storage.

2. **🧠 LangGraph Agentic Multi-Step Reasoning**:
   - Decides which legal tool to call (`retrieve_documents`, `extract_clauses`, `flag_risks`, `compare_documents`, `summarize_section`).
   - Renders a **live visual reasoning trace** in the UI showing step-by-step tool execution, arguments, and outputs.

3. **🎭 Dual Mode Q&A (Lawyer vs. Client)**:
   - **Client Mode**: Converts complex legalese into clear, plain English summaries.
   - **Lawyer Mode**: Provides formal legal analysis with precise clause citations.

4. **🗺️ Contract Risk Heatmap**:
   - Evaluates contracts section-by-section and assigns risk scores (**LOW**, **MEDIUM**, **HIGH**).
   - Flags one-sided indemnification, broad non-competes, and aggressive bonus clawback provisions.

5. **⚖️ Side-by-Side Contract Comparison**:
   - Compare any two legal documents (e.g., your standard NDA vs. a vendor's agreement) side-by-side with automated recommendations on which instrument is more favorable.

6. **⚡ 1-Click Pre-Loaded Demo Contracts**:
   - Includes instant sample contracts (Mutual NDA, Employment Agreement, SaaS MSA) for friction-free evaluation without requiring file uploads.

7. **🎯 Confidence Meter & Source Transparency**:
   - Displays real-time answer confidence percentages (0-100%) and clickable section citations.

---

## 🏗️ Technical Architecture

```
┌────────────────────────────────────────────────────────┐
│               LegalBuddy React Frontend                │
│       Vite + Tailwind CSS + Lucide Icons (Glassmorphic)│
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│            Vercel Serverless API (FastAPI)             │
│   /api/upload  /api/agent  /api/heatmap  /api/compare  │
└───────────┬───────────────────┬──────────────────┬─────┘
            │                   │                  │
            ▼                   ▼                  ▼
  ┌──────────────────┐  ┌───────────────┐  ┌──────────────┐
  │ Google Gemini API│  │ Pinecone DB   │  │ LangGraph    │
  │ (LLM + Embeddings)│  │ (Vector Store)│  │ (Agent Core) │
  └──────────────────┘  └───────────────┘  └──────────────┘
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
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX_NAME=legal-assistant
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
   - Add:
     - `GEMINI_API_KEY`
     - `PINECONE_API_KEY`
     - `PINECONE_INDEX_NAME`

5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploying via GitHub Integration

1. Push your repository to **GitHub**.
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Click **"Import Project"** and select your GitHub repository.
4. Framework Preset will be automatically detected as **Vite**.
5. Under **Environment Variables**, add `GEMINI_API_KEY`, `PINECONE_API_KEY`, `PINECONE_INDEX_NAME`.
6. Click **Deploy**. Vercel will automatically build the frontend and host the Python serverless function at `/api/*`.

---

## 📦 Deployment Package Structure

This project includes a complete deployment package containing:
- `api/` — FastAPI Python backend & LangGraph agent logic.
- `src/` — React modern glassmorphic frontend interface.
- `public/mascot.jpg` — Cute LegalBuddy cartoon owl logo asset.
- `vercel.json` — Pre-configured Vercel serverless build & rewrite rules.
- `requirements.txt` — Python dependencies.
- `package.json` — Frontend dependencies.

---

## ⚖️ License & Disclaimer

LegalBuddy is designed for portfolio demonstration, contract auditing, and legal decision support. It does not replace professional legal advice.
