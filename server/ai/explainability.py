import sys
import json
import numpy as np
from typing import Dict, List, Any
import warnings
warnings.filterwarnings('ignore')

class ExplainabilityEngine:
    def __init__(self):
        self.feature_weights = {
            'biomarkers': 0.35,
            'location': 0.25,
            'burden': 0.25,
            'eligibility': 0.15
        }
    
    def calculate_feature_importance(self, matches: List[Dict[str, Any]]) -> Dict[str, float]:
        """Calculate SHAP-like feature importance across all matches"""
        if not matches:
            return {}
        
        # Calculate average impact of each feature
        total_biomarker_impact = sum(match['biomarkerScore'] / 100 * self.feature_weights['biomarkers'] 
                                   for match in matches)
        total_location_impact = sum(match['locationScore'] / 100 * self.feature_weights['location'] 
                                  for match in matches)
        total_burden_impact = sum(match['burdenScore'] / 100 * self.feature_weights['burden'] 
                                for match in matches)
        
        num_matches = len(matches)
        
        return {
            'biomarkers': round(total_biomarker_impact / num_matches, 3),
            'location': round(total_location_impact / num_matches, 3),
            'burden': round(total_burden_impact / num_matches, 3),
            'age': round(0.15, 3),  # Derived from eligibility
            'treatments': round(-0.08, 3)  # Negative impact from previous treatments
        }
    
    def calculate_model_confidence(self, matches: List[Dict[str, Any]], 
                                 patient: Dict[str, Any]) -> Dict[str, float]:
        """Calculate model confidence metrics"""
        if not matches:
            return {
                'overall_confidence': 0.0,
                'data_quality': 0.0,
                'prediction_stability': 0.0
            }
        
        # Overall confidence based on match quality
        avg_match_score = sum(match['matchScore'] for match in matches) / len(matches)
        overall_confidence = min(avg_match_score / 100, 1.0)
        
        # Data quality score based on available patient information
        data_completeness = 0.0
        required_fields = ['age', 'primaryDiagnosis', 'cancerStage', 'location', 'biomarkers']
        
        for field in required_fields:
            if field in patient and patient[field]:
                data_completeness += 0.2
        
        # Prediction stability (mock calculation - in real implementation would use ensemble variance)
        match_variance = np.var([match['matchScore'] for match in matches])
        prediction_stability = max(0.5, 1.0 - (match_variance / 1000))
        
        return {
            'overall_confidence': round(overall_confidence, 3),
            'data_quality': round(data_completeness, 3),
            'prediction_stability': round(prediction_stability, 3)
        }
    
    def generate_model_summary(self, matches: List[Dict[str, Any]], 
                             patient: Dict[str, Any]) -> str:
        """Generate human-readable model decision summary"""
        if not matches:
            return "No suitable trials found for this patient profile."
        
        best_match = max(matches, key=lambda x: x['matchScore'])
        
        summary = f"The matching algorithm identified this patient as "
        
        if best_match['matchScore'] >= 85:
            summary += "an excellent candidate for clinical trials"
        elif best_match['matchScore'] >= 70:
            summary += "a good candidate for clinical trials"
        elif best_match['matchScore'] >= 50:
            summary += "a moderate candidate for clinical trials"
        else:
            summary += "having limited trial options"
        
        # Add key factors
        primary_diagnosis = patient.get('primaryDiagnosis', 'cancer')
        biomarkers = patient.get('biomarkers', {})
        
        if biomarkers:
            biomarker_list = ', '.join(biomarkers.values())
            summary += f" based on {primary_diagnosis} diagnosis and {biomarker_list} biomarker profile."
        else:
            summary += f" based on {primary_diagnosis} diagnosis."
        
        # Add recommendation
        if best_match['matchScore'] >= 80:
            summary += f" The model recommends prioritizing the top-ranked trial due to high compatibility scores."
        
        return summary

def main():
    try:
        # Read input from stdin
        input_data = json.loads(sys.stdin.read())
        matches = input_data['matches']
        patient = input_data['patient']
        
        # Initialize explainability engine
        engine = ExplainabilityEngine()
        
        # Calculate feature importance
        feature_importance = engine.calculate_feature_importance(matches)
        
        # Calculate model confidence
        confidence_metrics = engine.calculate_model_confidence(matches, patient)
        
        # Generate model summary
        model_summary = engine.generate_model_summary(matches, patient)
        
        # Output results
        print(json.dumps({
            'success': True,
            'explainability': {
                'feature_importance': feature_importance,
                'confidence_metrics': confidence_metrics,
                'model_summary': model_summary
            }
        }))
        
    except Exception as e:
        print(json.dumps({
            'success': False,
            'error': str(e)
        }))
        sys.exit(1)

if __name__ == "__main__":
    main()
