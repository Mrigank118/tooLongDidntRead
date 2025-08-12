# backend/app/services/clause_detector.py
import random

def demo_model(clauses):
    """
    This is a demo model that simulates the classification of clauses.
    It randomly assigns categories and risk levels for testing purposes.
    :param clauses: List of filtered clauses to be classified.
    :return: List of dictionaries containing clause, category, risk, and explanation.
    """
    categories = ['Exclusions', 'Treatment Limitations', 'Authorization Requirements', 'Network Restrictions']
    risk_levels = ['high', 'moderate', 'low']
    
    results = []
    for clause in clauses:
        result = {
            'clause': clause,
            'risk': random.choice(risk_levels),  # Randomly select a risk level for demo
            'category': random.choice(categories),  # Randomly select a category for demo
            'explanation': "This is a demo explanation for the clause."
        }
        results.append(result)
    
    return results
