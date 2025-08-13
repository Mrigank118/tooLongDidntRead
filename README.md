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
