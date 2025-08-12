# backend/app/api/filteration.py

def filter_clauses(extracted_text: str):
    """
    Filters extracted text to identify relevant clauses based on predefined keywords.
    :param extracted_text: The text extracted from the document (e.g., PDF).
    :return: A list of relevant clauses.
    """
    relevant_clauses = []
    
    # Split text into lines (assuming each clause is a line in the document)
    lines = extracted_text.split('\n')
    
    for line in lines:
        # Filter for lines that contain important keywords (you can expand this list)
        if any(keyword in line.lower() for keyword in ["coverage", "exclusion", "treatment", "benefit"]):
            relevant_clauses.append(line)
    return relevant_clauses

def filter_by_length(clauses, min_length=10):
    """
    Filters clauses by a minimum length.
    :param clauses: List of clauses to filter.
    :param min_length: Minimum length of clause to keep.
    :return: Filtered list of clauses.
    """
    return [clause for clause in clauses if len(clause.split()) >= min_length]

def filter_by_coverage(clauses):
    """
    Filters clauses that explicitly mention coverage.
    :param clauses: List of clauses to filter.
    :return: Filtered list of clauses.
    """
    return [clause for clause in clauses if "coverage" in clause.lower()]
