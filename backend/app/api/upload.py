from fastapi import APIRouter, File, UploadFile, HTTPException
import os
import shutil
import openai
from dotenv import load_dotenv
from backend.app.services.text_extractor import extract_text
from backend.app.api.filteration import filter_clauses, filter_by_length, filter_by_coverage
from backend.app.services.clause_detector import demo_model  # For demo model

# Load environment variables from .env file
load_dotenv()

# Get the OpenAI API key from environment variables
openai.api_key = os.getenv('OPENAI_API_KEY')

router = APIRouter()

# Variable to store the extracted text globally
extracted_text = "Covers"  # This will store the extracted content

# Route to upload the document and extract text
@router.post("/extract-text/")
async def extract_text_from_file(file: UploadFile = File(...)):
   try:
       # Save the uploaded file temporarily
       temp_dir = "temp"
       if not os.path.exists(temp_dir):
           os.makedirs(temp_dir)

       temp_file_path = f"{temp_dir}/{file.filename}"
       with open(temp_file_path, "wb") as temp_file:
           shutil.copyfileobj(file.file, temp_file)

       # Extract text from the uploaded file
       global extracted_text  # Use the global variable to store text
       extracted_text = extract_text(temp_file_path)

       # Save the extracted text to a .txt file
       extracted_text_file_path = "extracted_text.txt"
       with open(extracted_text_file_path, "w") as text_file:
           text_file.write(extracted_text)

       # Apply filtration layer
       filtered_clauses = filter_clauses(extracted_text)
      
       # Additional filtering (optional)
       filtered_clauses = filter_by_length(filtered_clauses, min_length=5)  # Example: Minimum 5 words per clause
       filtered_clauses = filter_by_coverage(filtered_clauses)  # Example: Only clauses mentioning coverage

       # Run AI model inference (replace demo model with real model)
       model_output = demo_model(filtered_clauses)  # Simulated model output

       # Clean up the temporary file
       os.remove(temp_file_path)

       # Convert output to meaningful format if needed (e.g., mapping predictions to categories)
       response = [{"clause": clause, "prediction": pred} for clause, pred in zip(filtered_clauses, model_output)]

       # Return the extracted clauses and model output
       return {"clauses": response, "extracted_text_file": extracted_text_file_path}

   except Exception as e:
       raise HTTPException(status_code=400, detail=str(e))
