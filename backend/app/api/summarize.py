from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json

router = APIRouter()

# Define request model for the API
class AskRequest(BaseModel):
    query: str

@router.post("/ask-question/")
async def ask_question(payload: AskRequest):
    query = (payload.query or "").strip()
    if not query:
        raise HTTPException(status_code=422, detail="Query cannot be empty.")

    # Here, you process the query based on your instructions
    if query.lower() == 'summarize':
        # Example of a processed summary
        summary_data = {
            "categories": [
                {
                    "category": "Hospitalization Expenses",
                    "what_it_provides": "Covers medical expenses for hospitalization due to illness or injury, including room rent, surgery, medications, etc.",
                    "hidden_clauses": "Room Rent limit applies 'At Actuals' unless specified. Proportionate deduction applies for higher room categories."
                },
                {
                    "category": "Pre-existing Conditions",
                    "what_it_provides": "Coverage for pre-existing conditions after a 36-month waiting period.",
                    "hidden_clauses": "Coverage only available after 36 months from the start of the policy. If the policy lapses, the waiting period restarts."
                }
            ]
        }

        # Return as JSON to frontend
        return summary_data
    else:
        raise HTTPException(status_code=400, detail="Invalid query")

