from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api import upload, askQuestion  # Correct import for the askQuestion file

app = FastAPI()

# Add CORS middleware to the FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Allow the frontend (React app) to access the API
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Register the upload API
app.include_router(upload.router)  # This will include the routes defined in `upload.py`

# Register the askQuestion API (your ask-question route)
app.include_router(askQuestion.router)  # This will include the routes defined in `askQuestion.py`
