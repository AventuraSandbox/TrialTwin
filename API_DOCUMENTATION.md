# TrialTwin API Documentation

## Overview

The TrialTwin API provides comprehensive endpoints for managing clinical trials, patients, digital twins, and AI-powered matching. All endpoints return JSON responses and use standard HTTP status codes.

**Base URL**: `http://localhost:5000/api`

## Authentication

Most endpoints require authentication. Include session cookies from login for authenticated requests.

### Login
```http
POST /api/login
Content-Type: application/json

{
  "username": "admin",
  "password": "your_password"
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

### Logout
```http
POST /api/logout
```

**Response**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Patient Management

### Get All Patients
```http
GET /api/patients
```

**Response**:
```json
[
  {
    "id": 1,
    "name": "Sarah Johnson",
    "age": 48,
    "diagnosis": "Breast Cancer",
    "stage": "Stage II",
    "location": "Boston, MA",
    "biomarkers": {
      "HER2": "positive",
      "ER": "positive",
      "PR": "negative"
    },
    "performanceStatus": "ECOG 1",
    "aiScore": 85,
    "matchScore": 92,
    "engagementScore": 78,
    "eligibilityScore": 90,
    "eligibleTrials": 3,
    "rank": 1,
    "bestMatch": {
      "trialId": 1,
      "matchScore": 92,
      "trialName": "HER2+ Breast Cancer Immunotherapy Trial"
    }
  }
]
```

### Get Patient by ID
```http
GET /api/patients/:id
```

**Response**:
```json
{
  "id": 1,
  "name": "Sarah Johnson",
  "age": 48,
  "diagnosis": "Breast Cancer",
  "stage": "Stage II",
  "location": "Boston, MA",
  "biomarkers": {
    "HER2": "positive",
    "ER": "positive",
    "PR": "negative"
  },
  "performanceStatus": "ECOG 1"
}
```

### Create Patient
```http
POST /api/patients
Content-Type: application/json

{
  "name": "Sarah Johnson",
  "age": 48,
  "diagnosis": "Breast Cancer",
  "stage": "Stage II",
  "location": "Boston, MA",
  "biomarkers": {
    "HER2": "positive",
    "ER": "positive",
    "PR": "negative"
  },
  "performanceStatus": "ECOG 1",
  "travelWillingness": "high",
  "supportSystem": "family",
  "previousTreatments": ["chemotherapy", "surgery"]
}
```

**Response**:
```json
{
  "success": true,
  "patient": {
    "id": 1,
    "name": "Sarah Johnson",
    "age": 48,
    "diagnosis": "Breast Cancer",
    "stage": "Stage II",
    "location": "Boston, MA",
    "biomarkers": {
      "HER2": "positive",
      "ER": "positive",
      "PR": "negative"
    },
    "performanceStatus": "ECOG 1"
  }
}
```

### Upload Patients (CSV)
```http
POST /api/patients/upload
Content-Type: multipart/form-data

file: patients.csv
```

**CSV Format**:
```csv
name,age,diagnosis,stage,location,HER2,ER,PR,performanceStatus
Sarah Johnson,48,Breast Cancer,Stage II,Boston MA,positive,positive,negative,ECOG 1
```

**Response**:
```json
{
  "success": true,
  "message": "Successfully imported 10 patients",
  "imported": 10,
  "errors": []
}
```

## Digital Twin Management

### Create Digital Twin
```http
POST /api/digital-twins
Content-Type: application/json

{
  "patientId": 1
}
```

**Response**:
```json
{
  "success": true,
  "digitalTwin": {
    "id": 1,
    "patientId": 1,
    "clinicalProfile": {
      "riskScore": "medium",
      "biomarkers": "HER2 positive, ER positive, PR negative",
      "performance": "ECOG 1"
    },
    "lifestyleFactors": {
      "mobility": "high",
      "support": "strong",
      "compliance": "excellent"
    },
    "engagementSignals": {
      "motivation": "high",
      "availability": "flexible",
      "techComfort": "comfortable"
    }
  }
}
```

### Get Digital Twin by Patient ID
```http
GET /api/digital-twins/patient/:patientId
```

**Response**:
```json
{
  "id": 1,
  "patientId": 1,
  "clinicalProfile": {
    "riskScore": "medium",
    "biomarkers": "HER2 positive, ER positive, PR negative",
    "performance": "ECOG 1"
  },
  "lifestyleFactors": {
    "mobility": "high",
    "support": "strong",
    "compliance": "excellent"
  },
  "engagementSignals": {
    "motivation": "high",
    "availability": "flexible",
    "techComfort": "comfortable"
  }
}
```

## Clinical Trials

### Get All Clinical Trials
```http
GET /api/clinical-trials
```

**Response**:
```json
[
  {
    "id": 1,
    "name": "HER2+ Breast Cancer Immunotherapy Trial",
    "phase": "Phase II",
    "sponsor": "PharmaCorp",
    "location": "Boston Medical Center",
    "enrollmentTarget": 150,
    "currentEnrollment": 45,
    "biomarkers": ["HER2 positive"],
    "eligibilityCriteria": [
      "Age 18-75",
      "HER2 positive breast cancer",
      "ECOG 0-2"
    ],
    "eligiblePatients": 12
  }
]
```

### Create Clinical Trial
```http
POST /api/clinical-trials
Content-Type: application/json

{
  "name": "HER2+ Breast Cancer Immunotherapy Trial",
  "phase": "Phase II",
  "sponsor": "PharmaCorp",
  "location": "Boston Medical Center",
  "enrollmentTarget": 150,
  "biomarkers": ["HER2 positive"],
  "eligibilityCriteria": [
    "Age 18-75",
    "HER2 positive breast cancer",
    "ECOG 0-2"
  ]
}
```

**Response**:
```json
{
  "success": true,
  "trial": {
    "id": 1,
    "name": "HER2+ Breast Cancer Immunotherapy Trial",
    "phase": "Phase II",
    "sponsor": "PharmaCorp",
    "location": "Boston Medical Center",
    "enrollmentTarget": 150,
    "currentEnrollment": 0,
    "biomarkers": ["HER2 positive"],
    "eligibilityCriteria": [
      "Age 18-75",
      "HER2 positive breast cancer",
      "ECOG 0-2"
    ]
  }
}
```

### Upload Clinical Trials (CSV)
```http
POST /api/clinical-trials/upload
Content-Type: multipart/form-data

file: trials.csv
```

**CSV Format**:
```csv
name,phase,sponsor,location,enrollmentTarget,biomarkers,eligibilityCriteria
HER2+ Breast Cancer Immunotherapy Trial,Phase II,PharmaCorp,Boston Medical Center,150,"HER2 positive","Age 18-75;HER2 positive breast cancer;ECOG 0-2"
```

**Response**:
```json
{
  "success": true,
  "message": "Successfully imported 5 trials",
  "imported": 5,
  "errors": []
}
```

## Trial Matching

### Get Trial Matches for Patient
```http
GET /api/trial-matches/:patientId
```

**Response**:
```json
[
  {
    "id": 1,
    "patientId": 1,
    "trialId": 1,
    "matchScore": 92,
    "biomarkerScore": 95,
    "locationScore": 88,
    "burdenScore": 85,
    "completionLikelihood": 0.92,
    "explanationFactors": {
      "biomarkerMatch": "Excellent HER2 positive match",
      "locationConvenience": "Close to patient location",
      "burdenAppropriate": "Patient can handle trial demands",
      "eligibilityMet": "All criteria satisfied"
    }
  }
]
```

### Generate Trial Matches
```http
POST /api/trial-matches
Content-Type: application/json

{
  "patientId": 1
}
```

**Response**:
```json
{
  "success": true,
  "matches": [
    {
      "id": 1,
      "patientId": 1,
      "trialId": 1,
      "matchScore": 92,
      "biomarkerScore": 95,
      "locationScore": 88,
      "burdenScore": 85,
      "completionLikelihood": 0.92,
      "explanationFactors": {
        "biomarkerMatch": "Excellent HER2 positive match",
        "locationConvenience": "Close to patient location",
        "burdenAppropriate": "Patient can handle trial demands",
        "eligibilityMet": "All criteria satisfied"
      }
    }
  ]
}
```

## Explainability Analysis

### Get AI Explanation
```http
GET /api/explainability/:patientId
```

**Response**:
```json
{
  "patientId": 1,
  "overallScore": 92,
  "factorAnalysis": {
    "biomarkerMatch": {
      "score": 95,
      "weight": 0.4,
      "contribution": 38,
      "explanation": "Patient has HER2 positive status matching trial requirements"
    },
    "locationConvenience": {
      "score": 88,
      "weight": 0.25,
      "contribution": 22,
      "explanation": "Patient is located within 30 miles of trial site"
    },
    "burdenAppropriate": {
      "score": 85,
      "weight": 0.2,
      "contribution": 17,
      "explanation": "Patient's performance status and support system suitable for trial demands"
    },
    "eligibilityMet": {
      "score": 90,
      "weight": 0.15,
      "contribution": 13.5,
      "explanation": "Patient meets all inclusion criteria and no exclusion criteria"
    }
  },
  "recommendations": [
    "High match score indicates excellent trial fit",
    "Consider patient's travel preferences for site selection",
    "Monitor patient's performance status throughout trial"
  ]
}
```

## Error Responses

All endpoints may return the following error formats:

### Validation Error (400)
```json
{
  "success": false,
  "error": "Validation failed: age must be a number"
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "error": "Patient not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": "Internal server error"
}
```

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute
- **Data retrieval endpoints**: 100 requests per minute
- **Data modification endpoints**: 20 requests per minute

## Data Formats

### Patient Schema
```typescript
interface Patient {
  id: number;
  name: string;
  age: number;
  diagnosis: string;
  stage: string;
  location: string;
  biomarkers: Record<string, string>;
  performanceStatus: string;
  travelWillingness?: string;
  supportSystem?: string;
  previousTreatments?: string[];
}
```

### Clinical Trial Schema
```typescript
interface ClinicalTrial {
  id: number;
  name: string;
  phase: string;
  sponsor: string;
  location: string;
  enrollmentTarget: number;
  currentEnrollment: number;
  biomarkers: string[];
  eligibilityCriteria: string[];
}
```

### Digital Twin Schema
```typescript
interface DigitalTwin {
  id: number;
  patientId: number;
  clinicalProfile: {
    riskScore: string;
    biomarkers: string;
    performance: string;
  };
  lifestyleFactors: {
    mobility: string;
    support: string;
    compliance: string;
  };
  engagementSignals: {
    motivation: string;
    availability: string;
    techComfort: string;
  };
}
```

### Trial Match Schema
```typescript
interface TrialMatch {
  id: number;
  patientId: number;
  trialId: number;
  matchScore: number;
  biomarkerScore: number;
  locationScore: number;
  burdenScore: number;
  completionLikelihood: number;
  explanationFactors: Record<string, string>;
}
```

## SDK Examples

### JavaScript/Node.js
```javascript
const API_BASE = 'http://localhost:5000/api';

// Login
const login = async (username, password) => {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password })
  });
  return response.json();
};

// Get patients with AI scores
const getPatients = async () => {
  const response = await fetch(`${API_BASE}/patients`, {
    credentials: 'include'
  });
  return response.json();
};

// Create patient
const createPatient = async (patientData) => {
  const response = await fetch(`${API_BASE}/patients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(patientData)
  });
  return response.json();
};
```

### Python
```python
import requests

API_BASE = 'http://localhost:5000/api'
session = requests.Session()

# Login
def login(username, password):
    response = session.post(f'{API_BASE}/login', json={
        'username': username,
        'password': password
    })
    return response.json()

# Get patients with AI scores
def get_patients():
    response = session.get(f'{API_BASE}/patients')
    return response.json()

# Create patient
def create_patient(patient_data):
    response = session.post(f'{API_BASE}/patients', json=patient_data)
    return response.json()
```

## WebSocket Events (Real-time Updates)

For real-time updates, connect to the WebSocket endpoint:

```javascript
const ws = new WebSocket('ws://localhost:5000/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'patient_updated':
      console.log('Patient updated:', data.patient);
      break;
    case 'trial_match_generated':
      console.log('New trial match:', data.match);
      break;
    case 'enrollment_update':
      console.log('Enrollment updated:', data.trial);
      break;
  }
};
```

## Testing

Use the provided test data or create your own test scenarios:

```bash
# Test with sample data
curl -X POST http://localhost:5000/api/patients/upload \
  -F "file=@test_patients.csv"

curl -X POST http://localhost:5000/api/clinical-trials/upload \
  -F "file=@test_trials.csv"
```

## Support

For API support and questions:
- **Documentation**: This file
- **Issues**: GitHub repository issues
- **Email**: support@trialtwin.com 