import { db } from "./db";
import { patients, digitalTwins, clinicalTrials, trialMatches } from "@shared/schema";

export async function seedDatabase() {
  try {
    // Check if data already exists
    const existingPatients = await db.select().from(patients).limit(1);
    if (existingPatients.length > 0) {
      console.log("Database already seeded");
      return;
    }

    // Create synthetic patients
    const syntheticPatients = [
      {
        firstName: "Sarah",
        lastName: "Johnson",
        age: 45,
        gender: "Female",
        primaryDiagnosis: "Breast Cancer",
        cancerStage: "Stage II",
        previousTreatments: ["Chemotherapy", "Radiation"],
        location: "Boston, MA",
        travelWillingness: "Within 50 miles",
        biomarkers: {
          "HER2": "Positive",
          "ER": "Positive",
          "PR": "Positive",
          "Ki67": "15%"
        },
        performanceStatus: "Excellent"
      },
      {
        firstName: "Michael",
        lastName: "Chen",
        age: 52,
        gender: "Male",
        primaryDiagnosis: "Lung Cancer",
        cancerStage: "Stage III",
        previousTreatments: ["Surgery", "Chemotherapy"],
        location: "Cambridge, MA",
        travelWillingness: "Within 100 miles",
        biomarkers: {
          "EGFR": "Mutated",
          "ALK": "Negative",
          "PD-L1": "High expression"
        },
        performanceStatus: "Good"
      },
      {
        firstName: "Emily",
        lastName: "Rodriguez",
        age: 38,
        gender: "Female",
        primaryDiagnosis: "Breast Cancer",
        cancerStage: "Stage I",
        previousTreatments: ["Surgery"],
        location: "Providence, RI",
        travelWillingness: "Within 25 miles",
        biomarkers: {
          "BRCA1": "Positive",
          "BRCA2": "Negative",
          "ER": "Negative",
          "PR": "Negative"
        },
        performanceStatus: "Excellent"
      },
      {
        firstName: "David",
        lastName: "Thompson",
        age: 61,
        gender: "Male",
        primaryDiagnosis: "Prostate Cancer",
        cancerStage: "Stage II",
        previousTreatments: ["Hormone Therapy"],
        location: "Worcester, MA",
        travelWillingness: "Within 75 miles",
        biomarkers: {
          "PSA": "Elevated",
          "Gleason": "7",
          "AR": "Positive"
        },
        performanceStatus: "Good"
      },
      {
        firstName: "Lisa",
        lastName: "Wang",
        age: 49,
        gender: "Female",
        primaryDiagnosis: "Ovarian Cancer",
        cancerStage: "Stage III",
        previousTreatments: ["Surgery", "Chemotherapy", "Immunotherapy"],
        location: "Springfield, MA",
        travelWillingness: "Within 50 miles",
        biomarkers: {
          "BRCA2": "Positive",
          "HRD": "Positive",
          "CA-125": "Elevated"
        },
        performanceStatus: "Fair"
      }
    ];

    // Insert patients
    const insertedPatients = await db.insert(patients).values(syntheticPatients).returning();
    console.log(`Seeded ${insertedPatients.length} patients`);

    // Create digital twins for each patient
    const digitalTwinData = insertedPatients.map(patient => ({
      patientId: patient.id,
      clinicalProfile: {
        riskScore: patient.cancerStage === "Stage I" ? "Low" : 
                  patient.cancerStage === "Stage II" ? "Medium" : "High",
        biomarkers: Object.entries(patient.biomarkers).map(([key, value]) => `${key}: ${value}`).join(", "),
        performance: patient.performanceStatus
      },
      lifestyleFactors: {
        mobility: patient.age < 50 ? "High" : "Medium",
        support: "Strong family support",
        compliance: patient.previousTreatments.length > 1 ? "Excellent" : "Good"
      },
      engagementSignals: {
        motivation: "High",
        availability: "Flexible",
        techComfort: patient.age < 55 ? "High" : "Medium"
      }
    }));

    const insertedTwins = await db.insert(digitalTwins).values(digitalTwinData).returning();
    console.log(`Seeded ${insertedTwins.length} digital twins`);

    // Get clinical trials
    const trials = await db.select().from(clinicalTrials);
    
    // Create trial matches
    const trialMatchData = [];
    for (const patient of insertedPatients) {
      for (const trial of trials) {
        // Calculate match scores based on patient and trial characteristics
        const biomarkerScore = calculateBiomarkerMatch(patient.biomarkers, trial.inclusionCriteria.biomarkers);
        const locationScore = calculateLocationMatch(patient.location, trial.location, patient.travelWillingness);
        const burdenScore = calculateBurdenMatch(patient.age, patient.cancerStage, trial.treatmentBurden);
        const matchScore = Math.round((biomarkerScore + locationScore + burdenScore) / 3);

        // Only create matches with score > 60
        if (matchScore > 60) {
          trialMatchData.push({
            patientId: patient.id,
            trialId: trial.id,
            matchScore,
            biomarkerScore,
            locationScore,
            burdenScore,
            completionLikelihood: matchScore > 80 ? "High" : matchScore > 65 ? "Medium" : "Low",
            explanationFactors: {
              positive: [
                { factor: "Biomarker Compatibility", impact: biomarkerScore, description: "Strong biomarker alignment" },
                { factor: "Location Convenience", impact: locationScore, description: "Acceptable travel distance" }
              ],
              negative: [
                { factor: "Treatment Burden", impact: 100 - burdenScore, description: "Moderate treatment complexity" }
              ]
            }
          });
        }
      }
    }

    if (trialMatchData.length > 0) {
      const insertedMatches = await db.insert(trialMatches).values(trialMatchData).returning();
      console.log(`Seeded ${insertedMatches.length} trial matches`);
    }

    console.log("Database seeding completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

function calculateBiomarkerMatch(patientBiomarkers: Record<string, string>, trialBiomarkers: string[]): number {
  const patientMarkers = Object.keys(patientBiomarkers);
  const matches = trialBiomarkers.filter(marker => 
    patientMarkers.some(pm => pm.toLowerCase().includes(marker.toLowerCase()) || marker.toLowerCase().includes(pm.toLowerCase()))
  );
  return Math.min(100, (matches.length / Math.max(trialBiomarkers.length, 1)) * 100);
}

function calculateLocationMatch(patientLocation: string, trialLocation: string, travelWillingness: string): number {
  const patientState = patientLocation.split(", ")[1];
  const trialState = trialLocation.split(", ")[1];
  
  if (patientState === trialState) {
    return travelWillingness.includes("25") ? 95 : 
           travelWillingness.includes("50") ? 90 : 
           travelWillingness.includes("75") ? 85 : 80;
  }
  return travelWillingness.includes("100") ? 70 : 50;
}

function calculateBurdenMatch(age: number, stage: string, treatmentBurden: string): number {
  let baseScore = 80;
  
  if (age > 65) baseScore -= 10;
  if (stage.includes("III") || stage.includes("IV")) baseScore -= 10;
  if (treatmentBurden === "High") baseScore -= 15;
  if (treatmentBurden === "Medium") baseScore -= 5;
  
  return Math.max(40, baseScore);
}