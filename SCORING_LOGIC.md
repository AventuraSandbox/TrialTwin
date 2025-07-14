# AI Scoring Logic Documentation

## Overview
The Digital Twin Clinical Trials Platform uses a sophisticated AI scoring system to match patients with optimal clinical trials. This document explains the scoring methodology and algorithms used throughout the platform.

## Core Scoring Components

### 1. Digital Twin Profile Generation
When a patient is onboarded, the system creates a digital twin profile based on their clinical and lifestyle data:

#### Clinical Profile
- **Risk Score**: Calculated based on cancer stage, age, and comorbidities
  - Stage I-II: Low risk
  - Stage III: Medium risk  
  - Stage IV: High risk
- **Biomarkers**: Extracted from patient's medical history and lab results
- **Performance Status**: ECOG performance status assessment

#### Lifestyle Factors
- **Mobility**: Based on age and performance status
- **Support System**: Assessed from family/caregiver information
- **Compliance**: Predicted from treatment history and patient characteristics

#### Engagement Signals
- **Motivation**: Derived from patient questionnaire responses
- **Availability**: Based on work status and life circumstances
- **Tech Comfort**: Assessed from age and digital literacy indicators

### 2. AI Matching Algorithm
The core matching algorithm uses four weighted scoring components:

#### A. Biomarker Score (Weight: 40%)
- **Calculation**: Compares patient biomarkers against trial requirements
- **Algorithm**: 
  ```
  biomarker_score = (matching_biomarkers / total_required_biomarkers) * 100
  ```
- **Factors**:
  - Exact biomarker matches get full points
  - Partial matches (e.g., mutation subtypes) get weighted scores
  - Missing critical biomarkers result in score penalties

#### B. Location Score (Weight: 25%)
- **Calculation**: Evaluates geographic accessibility and patient travel willingness
- **Algorithm**:
  ```
  location_score = base_distance_score * travel_willingness_multiplier
  ```
- **Factors**:
  - Distance to trial site (0-50 miles: 100%, 51-100 miles: 75%, etc.)
  - Patient's stated travel willingness
  - Transportation resources available

#### C. Burden Score (Weight: 20%)
- **Calculation**: Assesses patient's ability to handle trial demands
- **Algorithm**:
  ```
  burden_score = (100 - burden_penalty) * age_factor * performance_factor
  ```
- **Factors**:
  - Trial complexity (visits, procedures, duration)
  - Patient age and performance status
  - Previous treatment history and tolerance

#### D. Eligibility Score (Weight: 15%)
- **Calculation**: Binary and weighted eligibility criteria matching
- **Algorithm**:
  ```
  eligibility_score = (met_criteria / total_criteria) * 100
  ```
- **Factors**:
  - Hard inclusion/exclusion criteria (age, diagnosis, etc.)
  - Soft criteria with weighted importance
  - Prior treatment requirements

### 3. Final Match Score Calculation
The overall match score combines all components:

```
final_score = (biomarker_score * 0.40) + 
              (location_score * 0.25) + 
              (burden_score * 0.20) + 
              (eligibility_score * 0.15)
```

### 4. Completion Likelihood Prediction
Beyond matching, the system predicts trial completion likelihood:

#### High Likelihood (80-100%)
- Strong biomarker match
- Excellent support system
- Low treatment burden
- Close geographic proximity

#### Medium Likelihood (60-79%)
- Good biomarker match
- Adequate support system
- Moderate treatment burden
- Reasonable travel distance

#### Low Likelihood (40-59%)
- Partial biomarker match
- Limited support system
- High treatment burden
- Significant travel required

### 5. Explainable AI Features
The system provides transparent explanations for all scoring decisions:

#### Positive Factors
- Strong biomarker compatibility
- Excellent location match
- High patient motivation
- Optimal support system

#### Negative Factors
- Missing biomarker requirements
- High travel burden
- Performance status concerns
- Treatment complexity issues

#### Neutral Factors
- Adequate but not optimal matches
- Moderate risk factors
- Standard eligibility criteria

## Machine Learning Models

### Feature Importance Analysis
The system uses SHAP-like analysis to explain feature contributions:

1. **Biomarker Compatibility**: Highest importance (35-45%)
2. **Geographic Accessibility**: High importance (20-30%)
3. **Patient Performance**: Medium importance (15-25%)
4. **Support System**: Medium importance (10-20%)
5. **Previous Treatments**: Lower importance (5-15%)

### Model Confidence Metrics
- **Data Completeness**: Percentage of required data fields available
- **Prediction Stability**: Consistency across multiple model runs
- **Historical Accuracy**: Performance on similar patient profiles

## Scoring Validation

### Quality Assurance
- Regular validation against clinical outcomes
- Bias detection and correction algorithms
- Continuous model performance monitoring

### Feedback Loop
- Clinical team review of high-stakes decisions
- Patient outcome tracking and model refinement
- Regular algorithm updates based on real-world performance

## Implementation Details

### Real-time Scoring
- Scores are calculated dynamically when patients are matched
- Background processing for large patient cohorts
- Caching for frequently accessed trial matches

### Performance Optimization
- Parallel processing for multiple trial evaluations
- Efficient database queries for large datasets
- Machine learning model optimization for speed

<<<<<<< HEAD
## Regulatory Compliance

### Audit Trail
- All scoring decisions are logged with timestamps
- Explainability reports stored for regulatory review
=======
## Data Protection & Transparency

### Audit Trail
- All scoring decisions are logged with timestamps
- Explainability reports stored for transparency
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190
- Model versioning for reproducible results

### Data Privacy
- Patient data anonymization for model training
- Secure computation for sensitive biomarker data
<<<<<<< HEAD
- HIPAA compliance throughout the scoring process
=======
- Advanced encryption throughout the scoring process
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190

## Usage Guidelines

### For Clinical Teams
- Review explainability reports for high-stakes decisions
- Consider patient preferences alongside AI recommendations
- Use confidence scores to prioritize manual review cases

### For Patients
- AI scores are recommendations, not final decisions
- Clinical team always has final say on trial participation
- Patient preferences and concerns take precedence

### For Researchers
- Scoring methodology is continuously refined
- New biomarkers and criteria are regularly incorporated
- Performance metrics are transparently reported

## Future Enhancements

### Planned Improvements
- Integration of real-world evidence data
- Advanced natural language processing for clinical notes
- Predictive modeling for trial enrollment success
- Enhanced geographic and demographic bias correction

### Research Areas
- Federated learning across multiple institutions
- Integration with electronic health records
- Real-time patient monitoring and score updates
- Personalized treatment pathway optimization

---

*This documentation is updated regularly as the AI algorithms evolve. For technical implementation details, see the codebase documentation.*