# TLDR — Insurance T&Cs Vulnerability Highlighter & Summarizer

**TLDR** (Too Long; Didn’t Read) is an AI tool that simplifies **Insurance Terms & Conditions** by:
- Summarizing key points.
- Highlighting vulnerable clauses (Exclusions, Waiting Periods, etc.).
- Allowing users to ask questions in plain language.

---

## Problem
Insurance policies hide critical clauses in lengthy documents. Users skip reading them, leading to rejected claims and financial loss.

---

## Features
- 📄 Upload Insurance Policy PDF.
- ✍️ AI-generated Executive Summary.
- 🚨 Highlight Risk Clauses (Red = Critical, Orange = Moderate).
- ❓ Ask Questions and get AI-based answers.
- 📥 Download Full Report (Summary + Highlights + Q&A).

---

## API Flow
1. `/api/upload` — Upload PDF
2. `/api/parse` — Extract Text
3. `/api/summarize` — Generate Summary
4. `/api/highlight` — Detect Vulnerable Clauses
5. `/api/ask-question` — User Q&A
6. `/api/generate-report` — Download Report

---

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm
- Git
- (Optional) Docker & Docker Compose

---


## Project Setup

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Run Vite Dev Server
npm run dev

Backend Setup (FastAPI)

# Navigate to backend folder
From the root directory

# Create Python virtual environment
python -m venv venv
source venv/bin/activate    # For Linux/Mac
# venv\Scripts\activate     # For Windows

# Install Python dependencies
pip install -r requirements.txt


# Run FastAPI server
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000

