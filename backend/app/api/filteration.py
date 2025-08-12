import csv
import os
import re

# Path to dataset
DATASET_PATH = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),  # /backend/app/api
        "..", "..", "..",           # go up to project root
        "models", "dataset", "Updated_CombinedDataset.csv"
    )
)

print("Looking for dataset at:", DATASET_PATH)
print("Exists?", os.path.exists(DATASET_PATH))

def load_dataset_keywords():
    """
    Load 'Key Terms' from the dataset as lowercase keywords for matching.
    """
    keywords = set()
    if not os.path.exists(DATASET_PATH):
        print(f"❌ Dataset not found at {DATASET_PATH}")
        return keywords

    try:
        with open(DATASET_PATH, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row.get("Key_Terms"):
                    for term in row["Key_Terms"].split(","):
                        term = term.strip().lower()
                        if term:
                            keywords.add(term)
    except Exception as e:
        print(f"⚠️ Error reading dataset: {e}")
    return keywords

# Preload keywords once at import time
KEYWORDS = load_dataset_keywords()
print(f"✅ Loaded {len(KEYWORDS)} keywords from dataset.")

def normalize_text(text):
    """Lowercase and remove extra spaces/punctuation for better matching."""
    return re.sub(r"[^\w\s]", "", text.lower()).strip()

# Blacklist common boilerplate/header/footer phrases to exclude
BLACKLIST_PHRASES = [
    "please read carefully to understand your rights",
    "the clause is classified as",
    "based on legalbert analysis",
    "please read carefully to understand your rights, coverage, and obligations",
    # Add any other common unwanted phrases here
]

def is_blacklisted(text: str) -> bool:
    lowered = text.lower()
    return any(phrase in lowered for phrase in BLACKLIST_PHRASES)

def filter_clauses(extracted_text: str, min_length: int = 5):
    """
    Filters clauses from extracted PDF text using dataset keywords,
    excludes blacklisted boilerplate sentences,
    and enforces minimum length.
    """
    if not extracted_text.strip():
        print("⚠️ No extracted text provided.")
        return []

    relevant_clauses = []
    lines = extracted_text.split("\n")

    for line in lines:
        # Skip blacklisted phrases early
        if is_blacklisted(line):
            continue

        clean_line = normalize_text(line)
        if len(clean_line.split()) < min_length:
            continue

        # Match against dataset keywords
        for keyword in KEYWORDS:
            if keyword in clean_line:
                relevant_clauses.append(line.strip())
                break

    # Remove duplicates while preserving order
    seen = set()
    filtered = []
    for clause in relevant_clauses:
        if clause not in seen:
            seen.add(clause)
            filtered.append(clause)

    return filtered

def filter_by_coverage(clauses):
    """Special filter for coverage-related clauses."""
    return [clause for clause in clauses if "coverage" in clause.lower()]
