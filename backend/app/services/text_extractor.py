import fitz  # PyMuPDF
from docx import Document
import nltk

nltk.download('punkt')
from nltk.tokenize import sent_tokenize

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
            text = file.read()
        return text
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

def merge_lines(text: str) -> str:
    """
    Merge lines that are split in the middle of sentences.
    Lines that don't end with sentence-ending punctuation are merged with the next line.
    """
    lines = text.splitlines()
    merged = []
    buffer = ""

    sentence_endings = ('.', '!', '?', ';', ':')

    for line in lines:
        line = line.strip()
        if not line:
            continue
        if buffer:
            buffer += " " + line
        else:
            buffer = line

        if buffer[-1] in sentence_endings:
            merged.append(buffer.strip())
            buffer = ""

    if buffer:
        merged.append(buffer.strip())

    return " ".join(merged)

def split_into_clauses(text: str) -> list[str]:
    """
    Merge lines and split text into sentences/clauses using NLTK.
    """
    merged_text = merge_lines(text)
    clauses = sent_tokenize(merged_text)
    return clauses


def extract_clauses_from_text(text: str) -> list[str]:
    """
    Extract clauses by:
    - Splitting text into paragraphs (split on double newlines)
    - Merging broken lines within each paragraph
    - Stripping empty paragraphs
    """
    raw_paragraphs = text.split('\n\n')
    clauses = []

    sentence_endings = ('.', '!', '?', ';', ':')

    for para in raw_paragraphs:
        # Remove excessive line breaks inside paragraph and join lines that do not end with sentence-ending punctuation
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

        # Catch any trailing buffer content
        if buffer:
            merged_paragraphs.append(buffer.strip())

        # Add merged paragraphs as clauses
        clauses.extend(merged_paragraphs)

    # Filter out very short or garbage clauses
    clauses = [c for c in clauses if len(c) > 20]

    return clauses
