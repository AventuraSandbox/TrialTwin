import sys
import json
import numpy as np
from typing import Dict, List, Any, Tuple
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
import warnings
warnings.filterwarnings('ignore')

class TrialMatchingEngine:
    def __init__(self):
        self.scaler = StandardScaler()
        
    def calculate_biomarker_score(self, patient_biomarkers: Dict[str, str], 
                                trial_biomarkers: List[str]) -> float:
        """Calculate biomarker compatibility score"""
        patient_markers = set(patient_biomarkers.values())
        trial_markers = set(trial_biomarkers)
        
        if not trial_markers:
            return 0.5  # Neutral score if no specific biomarkers required
            
        overlap = len(patient_markers.intersection(trial_markers))
        total_required = len(trial_markers)
        
        return min(overlap / total_required, 1.0)
    
    def calculate_location_score(self, patient_location: str, 
                               trial_location: str, 
                               travel_willingness: str) -> float:
        """Calculate location compatibility score"""
        # Simplified location matching - in real implementation would use geocoding
        patient_state = patient_location.split(',')[-1].strip() if ',' in patient_location else patient_location
        trial_state = trial_location.split(',')[-1].strip() if ',' in trial_location else trial_location
        
        if patient_state.lower() == trial_state.lower():
            return 1.0
        
        # Adjust based on travel willingness
        travel_scores = {
            "Within 25 miles": 0.2,
            "Within 50 miles": 0.4,
            "Within 100 miles": 0.6,
            "Willing to travel anywhere": 0.8
        }
        
        return travel_scores.get(travel_willingness, 0.3)
    
    def calculate_burden_score(self, patient_age: int, 
                             cancer_stage: str, 
                             previous_treatments: List[str],
                             trial_burden: str) -> float:
        """Calculate treatment burden compatibility"""
        # Base burden tolerance
        base_tolerance = 0.8
        
        # Adjust for age
        if patient_age > 70:
            base_tolerance *= 0.8
        elif patient_age < 40:
            base_tolerance *= 1.1
            
        # Adjust for cancer stage
        stage_factors = {
            "Stage I": 1.0,
            "Stage II": 0.9,
            "Stage III": 0.8,
            "Stage IV": 0.7
        }
        base_tolerance *= stage_factors.get(cancer_stage, 0.8)
        
        # Adjust for previous treatments
        if len(previous_treatments) > 2:
            base_tolerance *= 0.9
            
        # Match with trial burden
        burden_compatibility = {
            "Low": 1.0,
            "Medium": 0.8,
            "High": 0.6
        }
        
        trial_burden_score = burden_compatibility.get(trial_burden, 0.7)
        
        return min(base_tolerance * trial_burden_score, 1.0)
    
    def calculate_eligibility_score(self, patient: Dict[str, Any], 
                                  trial: Dict[str, Any]) -> float:
        """Calculate basic eligibility score"""
        score = 1.0
        
        # Age eligibility
        age_range = trial['inclusionCriteria']['ageRange']
        if not (age_range['min'] <= patient['age'] <= age_range['max']):
            score *= 0.3
            
        # Cancer type eligibility
        if patient['primaryDiagnosis'] not in trial['inclusionCriteria']['cancerTypes']:
            score *= 0.2
            
        # Stage eligibility
        if patient['cancerStage'] not in trial['inclusionCriteria']['stages']:
            score *= 0.7
            
        return score
    
    def match_patient_to_trials(self, patient: Dict[str, Any], 
                              trials: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Main matching function"""
        matches = []
        
        for trial in trials:
            # Calculate component scores
            biomarker_score = self.calculate_biomarker_score(
                patient['biomarkers'], 
                trial['inclusionCriteria']['biomarkers']
            )
            
            location_score = self.calculate_location_score(
                patient['location'], 
                trial['location'], 
                patient['travelWillingness']
            )
            
            burden_score = self.calculate_burden_score(
                patient['age'],
                patient['cancerStage'],
                patient['previousTreatments'],
                trial['treatmentBurden']
            )
            
            eligibility_score = self.calculate_eligibility_score(patient, trial)
            
            # Calculate weighted overall score
            weights = {
                'biomarker': 0.35,
                'location': 0.25,
                'burden': 0.25,
                'eligibility': 0.15
            }
            
            overall_score = (
                biomarker_score * weights['biomarker'] +
                location_score * weights['location'] +
                burden_score * weights['burden'] +
                eligibility_score * weights['eligibility']
            )
            
            # Determine completion likelihood
            if overall_score >= 0.8:
                completion_likelihood = "High"
            elif overall_score >= 0.6:
                completion_likelihood = "Medium"
            else:
                completion_likelihood = "Low"
            
            # Generate explanation factors
            explanation_factors = self.generate_explanation_factors(
                biomarker_score, location_score, burden_score, eligibility_score
            )
            
            match = {
                'trialId': trial['id'],
                'matchScore': round(overall_score * 100, 1),
                'biomarkerScore': round(biomarker_score * 100, 1),
                'locationScore': round(location_score * 100, 1),
                'burdenScore': round(burden_score * 100, 1),
                'completionLikelihood': completion_likelihood,
                'explanationFactors': explanation_factors
            }
            
            matches.append(match)
        
        # Sort by match score
        matches.sort(key=lambda x: x['matchScore'], reverse=True)
        
        return matches
    
    def generate_explanation_factors(self, biomarker_score: float, 
                                   location_score: float, 
                                   burden_score: float, 
                                   eligibility_score: float) -> Dict[str, List[Dict[str, Any]]]:
        """Generate SHAP-like explanation factors"""
        positive_factors = []
        negative_factors = []
        
        # Biomarker factors
        if biomarker_score >= 0.8:
            positive_factors.append({
                'factor': 'Biomarker Match',
                'impact': round(biomarker_score * 0.35, 3),
                'description': f'Excellent biomarker compatibility ({biomarker_score*100:.0f}%)'
            })
        elif biomarker_score < 0.5:
            negative_factors.append({
                'factor': 'Biomarker Match',
                'impact': round((1 - biomarker_score) * 0.35, 3),
                'description': f'Limited biomarker compatibility ({biomarker_score*100:.0f}%)'
            })
        
        # Location factors
        if location_score >= 0.7:
            positive_factors.append({
                'factor': 'Location',
                'impact': round(location_score * 0.25, 3),
                'description': f'Favorable location match ({location_score*100:.0f}%)'
            })
        elif location_score < 0.4:
            negative_factors.append({
                'factor': 'Location',
                'impact': round((1 - location_score) * 0.25, 3),
                'description': f'Location may require significant travel ({location_score*100:.0f}%)'
            })
        
        # Burden factors
        if burden_score >= 0.7:
            positive_factors.append({
                'factor': 'Treatment Burden',
                'impact': round(burden_score * 0.25, 3),
                'description': f'Manageable treatment burden ({burden_score*100:.0f}%)'
            })
        elif burden_score < 0.5:
            negative_factors.append({
                'factor': 'Treatment Burden',
                'impact': round((1 - burden_score) * 0.25, 3),
                'description': f'High treatment burden may be challenging ({burden_score*100:.0f}%)'
            })
        
        # Eligibility factors
        if eligibility_score >= 0.8:
            positive_factors.append({
                'factor': 'Eligibility',
                'impact': round(eligibility_score * 0.15, 3),
                'description': f'Meets all eligibility criteria ({eligibility_score*100:.0f}%)'
            })
        elif eligibility_score < 0.6:
            negative_factors.append({
                'factor': 'Eligibility',
                'impact': round((1 - eligibility_score) * 0.15, 3),
                'description': f'Some eligibility concerns ({eligibility_score*100:.0f}%)'
            })
        
        return {
            'positive': positive_factors,
            'negative': negative_factors
        }

def main():
    try:
        # Read input from stdin
        input_data = json.loads(sys.stdin.read())
        patient = input_data['patient']
        trials = input_data['trials']
        
        # Initialize matching engine
        engine = TrialMatchingEngine()
        
        # Calculate matches
        matches = engine.match_patient_to_trials(patient, trials)
        
        # Output results
        print(json.dumps({
            'success': True,
            'matches': matches
        }))
        
    except Exception as e:
        print(json.dumps({
            'success': False,
            'error': str(e)
        }))
        sys.exit(1)

if __name__ == "__main__":
    main()
