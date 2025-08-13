Here's an updated version of your README with all the tech stack icons styled using badges:

---

# TLDR — Insurance T\&Cs Vulnerability Highlighter & Summarizer

**TLDR** simplifies insurance policies by summarizing key points, highlighting risky clauses, and answering user questions. Upload a PDF, and get an AI-generated summary, highlighted risks, and a downloadable report—making complex terms easy to understand.

---

## Problem

Insurance policies often hide critical clauses in lengthy documents. Users skip reading them, leading to rejected claims and financial loss.

---

## Features

* 📄 **Upload Insurance Policy PDF**: Easy upload process for your insurance policies.
* ✍️ **AI-generated Executive Summary**: Instant summary of key points.
* 🚨 **Highlight Risk Clauses**: Critical clauses marked in **red**, and moderate ones in **orange**.
* ❓ **Ask Questions**: Get AI-based answers to questions about clauses in plain language.
* 📥 **Download Full Report**: Get a comprehensive report containing the summary, highlights, and Q\&A.

---

## Tech Stack

### **Data Collection**

![BeautifulSoup](https://img.shields.io/badge/BeautifulSoup-14354C?style=for-the-badge\&logo=python\&logoColor=white)
![pdfplumber](https://img.shields.io/badge/pdfplumber-000000?style=for-the-badge\&logo=python\&logoColor=white)
![PyMuPDF](https://img.shields.io/badge/PyMuPDF-8E8E8E?style=for-the-badge\&logo=python\&logoColor=white)

* **BeautifulSoup**: Used for scraping and extracting clauses from various sources.
* **pdfplumber**: Extracts text from PDFs with high accuracy.
* **fitz** (PyMuPDF): Parses and extracts data from PDF files for clause analysis.

### **AI Model**

![LegalBERT](https://img.shields.io/badge/LegalBERT-%2320232a.svg?style=for-the-badge\&logo=python\&logoColor=white)

* **Fine-tuned LegalBERT**: A custom BERT model fine-tuned on insurance-related datasets for understanding and classifying legal language.
* **Risk Scoring Engine**: Python-based engine that scores clauses for risk (e.g., exclusions, waiting periods).

### **Chatbot**

![OpenAI](https://img.shields.io/badge/OpenAI-4B8B1B?style=for-the-badge\&logo=openai\&logoColor=white)

* **OpenAI API**: Powers the semantic search for clause-based Q\&A to answer user questions with contextual accuracy.

### **Backend**

![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge\&logo=fastapi\&logoColor=white)
![Uvicorn](https://img.shields.io/badge/Uvicorn-7D6B68?style=for-the-badge\&logo=python\&logoColor=white)

* **FastAPI**: Fast and modern Python web framework for building APIs.
* **Uvicorn**: ASGI server for running FastAPI applications at high speed.

### **Frontend**

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge\&logo=react\&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/Vite-%230a0a0a?style=for-the-badge\&logo=vite\&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-%2339B0B2?style=for-the-badge\&logo=tailwindcss\&logoColor=white)

* **React**: JavaScript framework for building interactive UIs.
* **Vite**: Fast build tool for modern web apps.
* **Tailwind CSS**: Utility-first CSS framework for custom, responsive designs.

### **Reports**

![ReportLab](https://img.shields.io/badge/ReportLab-0A0A0A?style=for-the-badge\&logo=python\&logoColor=white)

* **ReportLab**: Used for generating downloadable, color-coded PDF reports summarizing the analysis.

---

## Getting Started

### Prerequisites

* Python 3.9+
* Node.js 18+
* npm
* Git


---

## Project Setup

### Backend Setup (FastAPI)



1. From the Root, Create a Python virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # For Linux/Mac
   # venv\Scripts\activate  # For Windows
   ```

2. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Run the FastAPI server:

   ```bash
   uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup (React)

1. Navigate to the frontend folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the Vite Dev Server:

   ```bash
   npm run dev
   ```

---

## Collaborators



* **[@jainritikaa](https://github.com/jainritikaa)**
 
  ![GitHub](https://img.shields.io/badge/GitHub-jainritikaa-181717?style=for-the-badge\&logo=github\&logoColor=white)

* **[@Narendersing007](https://github.com/Narendersing007)**
  
  ![GitHub](https://img.shields.io/badge/GitHub-Narendersing007-181717?style=for-the-badge\&logo=github\&logoColor=white)

* **[@Mrigank118](https://github.com/Mrigank118)**
  
  ![GitHub](https://img.shields.io/badge/GitHub-Mrigank118-181717?style=for-the-badge\&logo=github\&logoColor=white)

---
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from google import genai  # Import the Gemini client

class AskRequest(BaseModel):
    query: str

router = APIRouter()

EXTRACTED_TEXT_PATH = "extracted_text.txt"
MAX_CONTEXT_CHARS = 200_000  # Trim huge files to avoid token limits

GEMINI_API_KEY = "AIzaSyBDjYvJUqnUeLWoa7KPyZAvHANwqGZqdgo"  # Replace with your actual API key

@router.post("/ask-question/")
async def ask_question(payload: AskRequest):
    query = (payload.query or "").strip()
    if not query:
        raise HTTPException(status_code=422, detail="Query cannot be empty.")

    if not os.path.exists(EXTRACTED_TEXT_PATH):
        raise HTTPException(status_code=404, detail="Extracted text file not found. Please upload a file first.")

    try:
        with open(EXTRACTED_TEXT_PATH, "r", encoding="utf-8", errors="ignore") as f:
            context = f.read()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read context: {e}")

    if not context.strip():
        raise HTTPException(status_code=400, detail="Extracted text is empty. Please re-upload a valid document.")

    if len(context) > MAX_CONTEXT_CHARS:
        context = context[:MAX_CONTEXT_CHARS]
    try:
        if query.lower() == "summarize":
            prompt = f"""
            Task:
            Please break down the insurance policy into a comprehensive table that highlights all essential details (including hidden clauses and fine print) that may not be explicitly emphasized on comparison websites or by the insurance company.

            Columns:
            - Category: A brief name for the aspect of the policy (e.g., Premium, Waiting Period, Co-payment Clause)
            - Details: Clear description of coverage, terms, or hidden clauses

            Include:
            - Basic Policy Information
            - Coverage Details
            - Waiting Periods
            - Premium Details
            - Exclusions and Hidden Clauses
            - Restoration and Cumulative Benefits
            - Non-Network Hospitals
            - Maternity and Newborn Coverage
            - Co-payment & Sub-limits
            - Critical Illness Coverage
            - Additional Features
            - Transparency Gaps

            Output: Table format, concise but specific, highlighting all important terms, waiting periods, exclusions, and hidden clauses.

            Context:
            {context}
            """
        else:
            prompt = (
                f"Answer the question directly using the provided context. "
                f"Question: {query}\n\n"
                f"Context:\n{context}"
            )

        result = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        answer = getattr(result, "text", None) or "Sorry, I couldn't generate a response."

        return {"answer": answer}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini error: {e}")
