Here's an improved version of your README with added collaborator tiles and a more structured presentation of the tech stack:

---

# TLDR — Insurance T\&Cs Vulnerability Highlighter & Summarizer

**TLDR** (Too Long; Didn’t Read) is an AI tool that simplifies **Insurance Terms & Conditions** by:

* Summarizing key points.
* Highlighting vulnerable clauses (Exclusions, Waiting Periods, etc.).
* Allowing users to ask questions in plain language.

---

## Problem

Insurance policies often bury critical clauses in lengthy documents. Users tend to skip reading these, leading to rejected claims and financial loss.

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

* **BeautifulSoup**: Used for scraping and extracting clauses from various sources.
* **pdfplumber**: Extracts text from PDFs with high accuracy.
* **fitz** (PyMuPDF): Parses and extracts data from PDF files for clause analysis.

### **AI Model**

* **Fine-tuned LegalBERT**: A custom BERT model fine-tuned on insurance-related datasets for understanding and classifying legal language.
* **Risk Scoring Engine**: Python-based engine that scores clauses for risk (e.g., exclusions, waiting periods).

### **Chatbot**

* **OpenAI API**: Powers the semantic search for clause-based Q\&A to answer user questions with contextual accuracy.

### **Backend**

* **FastAPI**: Fast and modern Python web framework for building APIs.
* **Uvicorn**: ASGI server for running FastAPI applications at high speed.

### **Frontend**

* **React**: JavaScript framework for building interactive UIs.
* **Vite**: Fast build tool for modern web apps.
* **Tailwind CSS**: Utility-first CSS framework for custom, responsive designs.

### **Reports**

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


1. From the Root Directory Create a Python virtual environment:

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
* **[@Narendersing007](https://github.com/Narendersing007)**
* **[@Mrigank118](https://github.com/Mrigank118)**

