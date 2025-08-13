import csv
import os
import re
import ast

DATASET_PATH = "/home/ritikajain/Downloads/tooLongDidntRead/models/dataset/Updated_CombinedDataset.csv"

def load_dataset_keywords():
    keywords = set()
    if not os.path.exists(DATASET_PATH):
        print(f"❌ Dataset not found at {DATASET_PATH}")
        return keywords

    try:
        with open(DATASET_PATH, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                key_terms_str = row.get("Key_Terms", "")
                if key_terms_str:
                    try:
                        terms = ast.literal_eval(key_terms_str)
                        for term in terms:
                            term = term.strip().lower()
                            if term:
                                keywords.add(term)
                    except Exception:
                        for term in key_terms_str.split(","):
                            term = term.strip().lower()
                            if term:
                                keywords.add(term)
    except Exception as e:
        print(f"⚠️ Error reading dataset: {e}")
    return keywords

KEYWORDS = load_dataset_keywords()

def normalize_text(text):
    return re.sub(r"[^\w\s]", "", text.lower()).strip()

BLACKLIST_PHRASES = [
    "please read carefully to understand your rights",
    "the clause is classified as",
    "based on legalbert analysis",
    "please read carefully to understand your rights, coverage, and obligations",
]

def is_blacklisted(text: str) -> bool:
    lowered = normalize_text(text)
    return any(phrase in lowered for phrase in BLACKLIST_PHRASES)

def contains_keyword(text, keywords):
    for kw in keywords:
        if re.search(r'\b' + re.escape(kw) + r'\b', text):
            return True
    return False

def filter_clauses(extracted_text: str, min_length: int = 5):
    if not extracted_text.strip():
        print("⚠️ No extracted text provided.")
        return []

    relevant_clauses = []
    lines = extracted_text.split("\n")

    for line in lines:
        if is_blacklisted(line):
            continue

        clean_line = normalize_text(line)
        if len(clean_line.split()) < min_length:
            continue

        if contains_keyword(clean_line, KEYWORDS):
            relevant_clauses.append(line.strip())

    # Remove duplicates while preserving order
    seen = set()
    filtered = []
    for clause in relevant_clauses:
        if clause not in seen:
            seen.add(clause)
            filtered.append(clause)

    return filtered

def filter_by_coverage(clauses):
    """Filter clauses that mention 'coverage'."""
    return [clause for clause in clauses if "coverage" in clause.lower()]
