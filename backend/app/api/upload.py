from fastapi import APIRouter, File, UploadFile, HTTPException
import os
import shutil
import openai
from dotenv import load_dotenv
from backend.app.services.text_extractor import extract_text
from backend.app.api.filteration import filter_clauses, filter_by_coverage
from backend.app.services.clause_detector import classify_clauses

# Load environment variables from .env file
load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')

router = APIRouter()
extracted_text = ""  # global

# Temporary definition if not already in filteration.py
def filter_by_length(clauses, min_length=5):
    """Keep only clauses with at least min_length words."""
    return [c for c in clauses if len(c.split()) >= min_length]

@router.post("/extract-text/")
async def extract_text_from_file(file: UploadFile = File(...)):
    if not file or file.filename == "":
        raise HTTPException(status_code=400, detail="No file uploaded")

    try:
        # Save file temporarily
        temp_dir = "temp"
        os.makedirs(temp_dir, exist_ok=True)
        temp_file_path = os.path.join(temp_dir, file.filename)

        with open(temp_file_path, "wb") as temp_file:
            shutil.copyfileobj(file.file, temp_file)

        # Extract text
        global extracted_text
        extracted_text = extract_text(temp_file_path)

        # Save extracted text to .txt
        extracted_text_file_path = "extracted_text.txt"
        with open(extracted_text_file_path, "w") as text_file:
            text_file.write(extracted_text)

        # Filtering pipeline
        filtered_clauses = filter_clauses(extracted_text)
        filtered_clauses = filter_by_length(filtered_clauses, min_length=5)
        filtered_clauses = filter_by_coverage(filtered_clauses)

        # Model inference
        model_output = classify_clauses(filtered_clauses)

        # Cleanup
        os.remove(temp_file_path)

        return {
            "clauses": [{"clause": c, "prediction": p} for c, p in zip(filtered_clauses, model_output)],
            "extracted_text_file": extracted_text_file_path
        }

    except Exception as e:
        # Log full error server-side
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")
