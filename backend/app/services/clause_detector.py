import fitz  # PyMuPDF
from docx import Document
import nltk
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from pathlib import Path

nltk.download('punkt')
from nltk.tokenize import sent_tokenize

# Model setup
MODEL_DIR = Path(__file__).resolve().parents[3] / "models" / "legalbert_clause_classifier"
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

tokenizer = AutoTokenizer.from_pretrained(str(MODEL_DIR))
model = AutoModelForSequenceClassification.from_pretrained(str(MODEL_DIR))
model.to(device)
model.eval()

id2label = {
    0: 'high Coverage',
    1: 'high Exclusion',
    2: 'high Limitation',
    3: 'high Monetary',
    4: 'high Waiting Period',
    5: 'low Coverage',
    6: 'low Exclusion',
    7: 'low Limitation',
    8: 'moderate Coverage',
    9: 'moderate Exclusion',
    10: 'moderate Monetary',
    11: 'moderate Waiting Period'
}

# Text extraction functions
def extract_text_from_pdf(file_path: str) -> str:
    try:
        doc = fitz.open(file_path)
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        return str(e)

def extract_text_from_docx(file_path: str) -> str:
    try:
        doc = Document(file_path)
        text = ""
        for para in doc.paragraphs:
            text += para.text + "\n"
        return text
    except Exception as e:
        return str(e)

def extract_text_from_txt(file_path: str) -> str:
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except Exception as e:
        return str(e)

def extract_text(file_path: str) -> str:
    if file_path.endswith('.pdf'):
        return extract_text_from_pdf(file_path)
    elif file_path.endswith('.docx'):
        return extract_text_from_docx(file_path)
    elif file_path.endswith('.txt'):
        return extract_text_from_txt(file_path)
    else:
        return "Unsupported file format."

# Clause extraction - improved merging lines and paragraphs
def extract_clauses_from_text(text: str) -> list[str]:
    raw_paragraphs = text.split('\n\n')
    clauses = []

    sentence_endings = ('.', '!', '?', ';', ':')

    for para in raw_paragraphs:
        lines = [line.strip() for line in para.splitlines() if line.strip()]
        buffer = ""
        merged_paragraphs = []

        for line in lines:
            if buffer:
                buffer += " " + line
            else:
                buffer = line

            if buffer[-1] in sentence_endings:
                merged_paragraphs.append(buffer.strip())
                buffer = ""

        if buffer:
            merged_paragraphs.append(buffer.strip())

        clauses.extend(merged_paragraphs)

    clauses = [c for c in clauses if len(c) > 20]

    return clauses

# Classification function
def classify_clauses(clauses: list[str]) -> list[dict]:
    inputs = tokenizer(
        clauses,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=256
    ).to(device)

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_ids = torch.argmax(logits, dim=-1).cpu().tolist()

    results = []
    for clause, pred_id in zip(clauses, predicted_ids):
        label = id2label[pred_id]
        risk, category = label.split(" ", 1)

        results.append({
            "clause": clause,
            "risk": risk.lower(),
            "category": category,
            "explanation": f"The clause is classified as '{label}' based on LegalBERT analysis."
        })

    return results

# Example entrypoint function to run all steps
def analyze_document(file_path: str) -> list[dict]:
    raw_text = extract_text(file_path)
    clauses = extract_clauses_from_text(raw_text)
    results = classify_clauses(clauses)
    return results

# If you want, add a test run when executing this script directly:
if __name__ == "__main__":
    test_file = "path/to/your/file.pdf"  # change to your file path
    classification_results = analyze_document(test_file)
    for r in classification_results:
        print(f"Clause: {r['clause']}\nRisk: {r['risk']}\nCategory: {r['category']}\nExplanation: {r['explanation']}\n---")
