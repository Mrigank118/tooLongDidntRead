import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from pathlib import Path

# ======== Absolute clean path to your model directory ========
# clause_detector.py → services/ → app/ → backend/ → project root → models/
MODEL_DIR = Path(__file__).resolve().parents[3] / "models" / "legalbert_clause_classifier"

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Convert Path to string so HF treats it as local dir
tokenizer = AutoTokenizer.from_pretrained(str(MODEL_DIR))
model = AutoModelForSequenceClassification.from_pretrained(str(MODEL_DIR))
model.to(device)
model.eval()

# Mapping from model output IDs to labels
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

def classify_clauses(clauses):
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

# Keep old name for compatibility
demo_model = classify_clauses
