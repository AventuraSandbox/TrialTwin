import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPatientSchema, patientIntakeSchema } from "@shared/schema";
import { spawn } from "child_process";
import path from "path";
import { setupAuth } from "./auth";
import multer from "multer";
import fs from "fs";
import { parse } from "csv-parse";

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  // Patient routes
  app.post("/api/patients", async (req, res) => {
    try {
      const validatedData = patientIntakeSchema.parse(req.body);
      
      // Create patient with additional fields
      const patient = await storage.createPatient({
        ...validatedData,
        biomarkers: req.body.biomarkers || {},
        performanceStatus: req.body.performanceStatus || "ECOG 1",
      });
      
      res.json({ success: true, patient });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.get("/api/patients/:id", async (req, res) => {
    try {
      const patient = await storage.getPatient(parseInt(req.params.id));
      if (!patient) {
        return res.status(404).json({ success: false, error: "Patient not found" });
      }
      res.json(patient);
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get all patients with AI rankings
  app.get("/api/patients", async (req, res) => {
    try {
      const patients = await storage.getAllPatients();
      const trials = await storage.getAllClinicalTrials();
      
      // Calculate AI scores for each patient
      const patientsWithScores = await Promise.all(patients.map(async (patient) => {
        // Get trial matches for this patient
        const matches = await storage.getTrialMatchesByPatientId(patient.id);
        
        // Calculate overall AI score (average of all match scores)
        const avgMatchScore = matches.length > 0 
          ? matches.reduce((sum, match) => sum + match.matchScore, 0) / matches.length
          : 0;
        
        // Calculate engagement score based on patient factors
        const engagementScore = calculateEngagementScore(patient);
        
        // Calculate eligibility score based on number of eligible trials
        const eligibilityScore = (matches.length / Math.max(trials.length, 1)) * 100;
        
        // Overall AI score is weighted average
        const overallScore = Math.round(
          (avgMatchScore * 0.5) + 
          (engagementScore * 0.3) + 
          (eligibilityScore * 0.2)
        );
        
        return {
          ...patient,
          aiScore: overallScore,
          matchScore: Math.round(avgMatchScore),
          engagementScore: Math.round(engagementScore),
          eligibilityScore: Math.round(eligibilityScore),
          eligibleTrials: matches.length,
          bestMatch: matches.length > 0 ? matches.reduce((best, current) => 
            current.matchScore > best.matchScore ? current : best
          ) : null
        };
      }));
      
      // Sort patients by AI score (highest first)
      patientsWithScores.sort((a, b) => b.aiScore - a.aiScore);
      
      // Add ranking
      const rankedPatients = patientsWithScores.map((patient, index) => ({
        ...patient,
        rank: index + 1
      }));
      
      res.json(rankedPatients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch patients" });
    }
  });

  // Digital twin routes
  app.post("/api/digital-twins", async (req, res) => {
    try {
      const { patientId } = req.body;
      
      const patient = await storage.getPatient(patientId);
      if (!patient) {
        return res.status(404).json({ success: false, error: "Patient not found" });
      }

      // Generate digital twin profile based on patient data
      const digitalTwin = await storage.createDigitalTwin({
        patientId,
        clinicalProfile: {
          riskScore: calculateRiskScore(patient),
          biomarkers: Object.values(patient.biomarkers).join(", ") || "Unknown",
          performance: patient.performanceStatus || "ECOG 1",
        },
        lifestyleFactors: {
          mobility: calculateMobility(patient),
          support: calculateSupport(patient),
          compliance: calculateCompliance(patient),
        },
        engagementSignals: {
          motivation: calculateMotivation(patient),
          availability: calculateAvailability(patient),
          techComfort: calculateTechComfort(patient),
        },
      });

      res.json({ success: true, digitalTwin });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.get("/api/digital-twins/patient/:patientId", async (req, res) => {
    try {
      const patientId = parseInt(req.params.patientId);
      let digitalTwin = await storage.getDigitalTwinByPatientId(patientId);
      
      if (!digitalTwin) {
        // Auto-create digital twin if it doesn't exist
        const patient = await storage.getPatient(patientId);
        if (!patient) {
          return res.status(404).json({ success: false, error: "Patient not found" });
        }
        
        digitalTwin = await storage.createDigitalTwin({
          patientId,
          clinicalProfile: {
            riskScore: calculateRiskScore(patient),
            biomarkers: Object.values(patient.biomarkers).join(", ") || "Unknown",
            performance: patient.performanceStatus || "ECOG 1",
          },
          lifestyleFactors: {
            mobility: calculateMobility(patient),
            support: calculateSupport(patient),
            compliance: calculateCompliance(patient),
          },
          engagementSignals: {
            motivation: calculateMotivation(patient),
            availability: calculateAvailability(patient),
            techComfort: calculateTechComfort(patient),
          },
        });
      }
      
      res.json(digitalTwin);
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Clinical trials routes
  app.get("/api/clinical-trials", async (req, res) => {
    try {
      const trials = await storage.getAllClinicalTrials();
      const allPatients = await storage.getAllPatients();
      
      // Calculate eligible patient count for each trial
      const trialsWithPatientCounts = await Promise.all(trials.map(async (trial) => {
        let eligiblePatients = 0;
        
        // Count patients eligible for this trial
        for (const patient of allPatients) {
          // Get or generate trial matches for this patient
          let matches = await storage.getTrialMatchesByPatientId(patient.id);
          
          // If no matches exist, generate them
          if (matches.length === 0) {
            const generatedMatches = generateTrialMatches(patient, trials);
            for (const match of generatedMatches) {
              await storage.createTrialMatch({
                patientId: patient.id,
                trialId: match.trialId,
                matchScore: match.matchScore,
                biomarkerScore: match.biomarkerScore,
                locationScore: match.locationScore,
                burdenScore: match.burdenScore,
                completionLikelihood: match.completionLikelihood,
                explanationFactors: match.explanationFactors
              });
            }
            matches = await storage.getTrialMatchesByPatientId(patient.id);
          }
          
<<<<<<< HEAD
          // Check if patient has a cancer type-compatible match for this trial (score >= 50)
          const trialMatch = matches.find(match => match.trialId === trial.id);
          if (trialMatch && trialMatch.matchScore >= 50) {
=======
          // Check if patient has a good match for this trial (score >= 70)
          const trialMatch = matches.find(match => match.trialId === trial.id);
          if (trialMatch && trialMatch.matchScore >= 70) {
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190
            eligiblePatients++;
          }
        }
        
        return {
          ...trial,
          eligiblePatients
        };
      }));
      
      res.json(trialsWithPatientCounts);
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  app.post("/api/clinical-trials", async (req, res) => {
    try {
      const trialData = {
        ...req.body,
        biomarkers: req.body.biomarkers || [],
        eligibilityCriteria: req.body.eligibilityCriteria || [],
      };
      
      const trial = await storage.createClinicalTrial(trialData);
      res.json({ success: true, trial });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // CSV Upload route for bulk clinical trials import
  app.post("/api/clinical-trials/upload", upload.single('csvFile'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
      }

      const filePath = req.file.path;
      const trials: any[] = [];

      // Parse CSV file
      const parsePromise = new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(parse({
            columns: true,
            skip_empty_lines: true,
            trim: true
          }))
          .on('data', (row) => {
            // Debug: log available columns for first row
            if (trials.length === 0) {
              console.log('Trial CSV columns available:', Object.keys(row));
            }
            
            // Try multiple field names for trial title/name
            const titleFields = [
              'title', 'Title', 'name', 'Name', 'trial_name', 'Trial Name', 
              'study_title', 'Study Title', 'protocol_title', 'Protocol Title',
              'trial_title', 'Trial Title', 'study_name', 'Study Name'
            ];
            
            let trialName = '';
            for (const field of titleFields) {
              if (row[field] && row[field].trim()) {
                trialName = row[field].trim();
                break;
              }
            }
            
            if (!trialName) {
              trialName = "Untitled Trial";
            }
            
            // Debug: log trial name extraction for first few trials
            if (trials.length < 3) {
              console.log(`Trial ${trials.length + 1} name extracted:`, trialName);
            }
            
            trials.push({
              name: trialName,
              sponsor: row.sponsor || row.Sponsor || "Unknown Sponsor",
              phase: row.phase || row.Phase || "Phase I",
              location: row.location || row.Location || "Multiple Sites",
              description: row.description || row.Description || "Clinical trial for " + (row.indication || row.Indication || "cancer treatment"),
              currentEnrollment: parseInt(row.currentEnrollment || row['Current Enrollment'] || '0'),
              maxEnrollment: parseInt(row.maxEnrollment || row['Max Enrollment'] || '100'),
              inclusionCriteria: {
                biomarkers: (row.biomarkers || row.Biomarkers || "").split(",").map((b: string) => b.trim()).filter(Boolean),
                cancerTypes: (row.cancerTypes || row['Cancer Types'] || row.indication || row.Indication || "").split(",").map((c: string) => c.trim()).filter(Boolean),
                stages: (row.stages || row.Stages || "Stage I,Stage II,Stage III").split(",").map((s: string) => s.trim()).filter(Boolean),
                ageRange: {
                  min: parseInt(row.minAge || row['Min Age'] || '18'),
                  max: parseInt(row.maxAge || row['Max Age'] || '80')
                }
              },
              exclusionCriteria: {
                conditions: (row.exclusionCriteria || row['Exclusion Criteria'] || "").split(",").map((c: string) => c.trim()).filter(Boolean),
                medications: (row.excludedMedications || row['Excluded Medications'] || "").split(",").map((m: string) => m.trim()).filter(Boolean)
              },
              treatmentBurden: row.treatmentBurden || row['Treatment Burden'] || "Medium",
              travelBurden: row.travelBurden || row['Travel Burden'] || "Medium",
              isActive: (row.isActive || row['Is Active'] || 'true') !== "false"
            });
          })
          .on('end', () => resolve(trials))
          .on('error', (err) => reject(err));
      });

      await parsePromise;

      // Bulk insert trials
      const insertedTrials = await storage.bulkCreateTrials(trials);
      
      // Clean up uploaded file
      fs.unlinkSync(filePath);

      res.json({ 
        success: true, 
        message: `Successfully imported ${insertedTrials.length} clinical trials`,
        count: insertedTrials.length 
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Trial matching routes
  app.post("/api/trial-matches", async (req, res) => {
    try {
      const { patientId } = req.body;
      
      const patient = await storage.getPatient(patientId);
      if (!patient) {
        return res.status(404).json({ success: false, error: "Patient not found" });
      }

      const trials = await storage.getAllClinicalTrials();
      
      // Call Python AI matching engine
      const matches = await runAIMatching(patient, trials);
      
      // Store matches in database
      for (const match of matches) {
        await storage.createTrialMatch({
          patientId,
          trialId: match.trialId,
          matchScore: match.matchScore,
          biomarkerScore: match.biomarkerScore,
          locationScore: match.locationScore,
          burdenScore: match.burdenScore,
          completionLikelihood: match.completionLikelihood,
          explanationFactors: match.explanationFactors,
        });
      }

      res.json({ success: true, matches });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/trial-matches/patient/:patientId", async (req, res) => {
    try {
      const patientId = parseInt(req.params.patientId);
      
      // First check if matches already exist
      let matches = await storage.getTrialMatchesByPatientId(patientId);
      
      // If no matches exist, generate them
      if (matches.length === 0) {
        const patient = await storage.getPatient(patientId);
        const trials = await storage.getAllClinicalTrials();
        
        if (patient && trials.length > 0) {
          // Generate matches using simple matching algorithm
          const generatedMatches = generateTrialMatches(patient, trials);
          
          // Store the matches
          for (const match of generatedMatches) {
            await storage.createTrialMatch({
              patientId: patient.id,
              trialId: match.trialId,
              matchScore: match.matchScore,
              biomarkerScore: match.biomarkerScore,
              locationScore: match.locationScore,
              burdenScore: match.burdenScore,
              completionLikelihood: match.completionLikelihood,
              explanationFactors: match.explanationFactors
            });
          }
          
          // Fetch the newly created matches
          matches = await storage.getTrialMatchesByPatientId(patientId);
        }
      }
      
      res.json(matches);
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get all trial matches
  app.get("/api/trial-matches", async (req, res) => {
    try {
      const patients = await storage.getAllPatients();
      const allMatches = [];
      
      for (const patient of patients) {
        const matches = await storage.getTrialMatchesByPatientId(patient.id);
        allMatches.push(...matches);
      }
      
      res.json(allMatches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trial matches" });
    }
  });

  // Explainability routes
  app.post("/api/explainability", async (req, res) => {
    try {
      const { matches, patient } = req.body;
      
      // Call Python explainability engine
      const explainability = await runExplainabilityAnalysis(matches, patient);
      
      res.json({ success: true, explainability });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Dashboard metrics
  app.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json({ success: true, metrics });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // CSV Upload route for bulk patient import
  app.post("/api/patients/upload", upload.single('csvFile'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
      }

      const filePath = req.file.path;
      const patients: any[] = [];

      // Parse CSV file
      const parsePromise = new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(parse({ 
            columns: true, 
            skip_empty_lines: true 
          }))
          .on('data', (row) => {
            try {
              // Debug: log available columns for first row
              if (patients.length === 0) {
                console.log('CSV columns available:', Object.keys(row));
              }
              
              // Try to extract location from various possible column names
              const locationFields = [
                'Location', 'location', 'City', 'city', 'State', 'state', 'Address', 'address',
                'City, State', 'city, state', 'City/State', 'city/state', 'City State', 'city state',
                'Home Location', 'home location', 'Residence', 'residence', 'Home Address', 'home address',
                'Geographic Location', 'geographic location', 'Patient Location', 'patient location',
                'Home City', 'home city', 'Current Location', 'current location'
              ];
              
              let extractedLocation = '';
              for (const field of locationFields) {
                if (row[field] && row[field].trim()) {
                  extractedLocation = row[field].trim();
                  break;
                }
              }
              
              // If no location found, try to combine city and state
              if (!extractedLocation) {
                const city = row['City'] || row['city'] || '';
                const state = row['State'] || row['state'] || '';
                if (city && state) {
                  extractedLocation = `${city}, ${state}`;
                } else if (city) {
                  extractedLocation = city;
                } else if (state) {
                  extractedLocation = state;
                }
              }
              
              // If still no location, provide a default realistic location
              if (!extractedLocation) {
                const defaultLocations = [
                  'Boston, MA', 'New York, NY', 'Philadelphia, PA', 'Washington, DC', 'Atlanta, GA',
                  'Chicago, IL', 'Houston, TX', 'Los Angeles, CA', 'San Francisco, CA', 'Seattle, WA'
                ];
                extractedLocation = defaultLocations[patients.length % defaultLocations.length];
              }
              
              // Transform CSV row to patient format
              const patient = {
                firstName: row['First Name'] || row['firstName'] || '',
                lastName: row['Last Name'] || row['lastName'] || '',
                age: parseInt(row['Age'] || row['age'] || '0'),
                gender: row['Gender'] || row['gender'] || '',
                primaryDiagnosis: row['Primary Diagnosis'] || row['primaryDiagnosis'] || '',
                cancerStage: row['Cancer Stage'] || row['cancerStage'] || '',
                previousTreatments: (row['Previous Treatments'] || row['previousTreatments'] || '').split(',').map((t: string) => t.trim()).filter(t => t),
                location: extractedLocation,
                travelWillingness: row['Travel Willingness'] || row['travelWillingness'] || 'Within 50 miles',
                biomarkers: (() => {
                  try {
                    return JSON.parse(row['Biomarkers'] || row['biomarkers'] || '{}');
                  } catch {
                    return {};
                  }
                })(),
                performanceStatus: row['Performance Status'] || row['performanceStatus'] || 'ECOG 1'
              };
              
              // Debug: log location extraction for first few patients
              if (patients.length < 5) {
                console.log(`Patient ${patients.length + 1} location extracted:`, extractedLocation);
              }
              
              patients.push(patient);
            } catch (err) {
              console.error('Error parsing CSV row:', err);
            }
          })
          .on('end', () => resolve(patients))
          .on('error', (err) => reject(err));
      });

      await parsePromise;

      // Bulk create patients
      const createdPatients = await storage.bulkCreatePatients(patients);

      // Clean up uploaded file
      fs.unlinkSync(filePath);

      res.json({ 
        success: true, 
        message: `Successfully imported ${createdPatients.length} patients`,
        count: createdPatients.length,
        patients: createdPatients 
      });

    } catch (error) {
      // Clean up file if it exists
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (cleanupError) {
          console.error('Error cleaning up file:', cleanupError);
        }
      }
      
      res.status(500).json({ 
        success: false, 
        error: `Failed to import patients: ${(error as Error).message}` 
      });
    }
  });

  // CSV Upload route for bulk trial import
  app.post("/api/trials/upload", upload.single('csvFile'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
      }

      const filePath = req.file.path;
      const trials: any[] = [];

      // Parse CSV file
      const parsePromise = new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(parse({ 
            columns: true, 
            skip_empty_lines: true 
          }))
          .on('data', (row) => {
            try {
              // Transform CSV row to trial format
              const trial = {
                name: row['Trial Name'] || row['name'] || '',
                sponsor: row['Sponsor'] || row['sponsor'] || '',
                phase: row['Phase'] || row['phase'] || '',
                location: row['Location'] || row['location'] || '',
                currentEnrollment: parseInt(row['Current Enrollment'] || row['currentEnrollment'] || '0'),
                maxEnrollment: parseInt(row['Max Enrollment'] || row['maxEnrollment'] || '100'),
                inclusionCriteria: (() => {
                  try {
                    return JSON.parse(row['Inclusion Criteria'] || row['inclusionCriteria'] || '{}');
                  } catch {
                    return {
                      biomarkers: [],
                      cancerTypes: [],
                      stages: [],
                      ageRange: { min: 18, max: 80 }
                    };
                  }
                })(),
                exclusionCriteria: (row['Exclusion Criteria'] || row['exclusionCriteria'] || '').split(',').map((e: string) => e.trim()).filter((e: string) => e),
                treatmentBurden: row['Treatment Burden'] || row['treatmentBurden'] || 'Medium',
                travelBurden: row['Travel Burden'] || row['travelBurden'] || 'Medium',
                description: row['Description'] || row['description'] || '',
                isActive: (row['Is Active'] || row['isActive'] || 'true').toLowerCase() === 'true'
              };
              trials.push(trial);
            } catch (err) {
              console.error('Error parsing CSV row:', err);
            }
          })
          .on('end', () => resolve(trials))
          .on('error', (err) => reject(err));
      });

      await parsePromise;

      // Bulk create trials
      const createdTrials = await storage.bulkCreateTrials(trials);

      // Clean up uploaded file
      fs.unlinkSync(filePath);

      res.json({ 
        success: true, 
        message: `Successfully imported ${createdTrials.length} trials`,
        count: createdTrials.length,
        trials: createdTrials 
      });

    } catch (error) {
      // Clean up file if it exists
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (cleanupError) {
          console.error('Error cleaning up file:', cleanupError);
        }
      }
      
      res.status(500).json({ 
        success: false, 
        error: `Failed to import trials: ${(error as Error).message}` 
      });
    }
  });

  // CSV Upload route for bulk trial import
  app.post("/api/trials/upload", upload.single('csvFile'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
      }

      const filePath = req.file.path;
      const trials: any[] = [];

      // Parse CSV file
      const parsePromise = new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(parse({ 
            columns: true, 
            skip_empty_lines: true 
          }))
          .on('data', (row) => {
            try {
              // Transform CSV row to trial format
              const trial = {
                name: row['Trial Name'] || row['name'] || '',
                sponsor: row['Sponsor'] || row['sponsor'] || '',
                phase: row['Phase'] || row['phase'] || '',
                location: row['Location'] || row['location'] || '',
                currentEnrollment: parseInt(row['Current Enrollment'] || row['currentEnrollment'] || '0'),
                maxEnrollment: parseInt(row['Max Enrollment'] || row['maxEnrollment'] || '100'),
                inclusionCriteria: (() => {
                  try {
                    return JSON.parse(row['Inclusion Criteria'] || row['inclusionCriteria'] || '{}');
                  } catch {
                    return {
                      biomarkers: [],
                      cancerTypes: [],
                      stages: [],
                      ageRange: { min: 18, max: 80 }
                    };
                  }
                })(),
                exclusionCriteria: (row['Exclusion Criteria'] || row['exclusionCriteria'] || '').split(',').map((e: string) => e.trim()).filter((e: string) => e),
                treatmentBurden: row['Treatment Burden'] || row['treatmentBurden'] || 'Medium',
                travelBurden: row['Travel Burden'] || row['travelBurden'] || 'Medium',
                description: row['Description'] || row['description'] || '',
                isActive: (row['Is Active'] || row['isActive'] || 'true').toLowerCase() === 'true'
              };
              trials.push(trial);
            } catch (err) {
              console.error('Error parsing CSV row:', err);
            }
          })
          .on('end', () => resolve(trials))
          .on('error', (err) => reject(err));
      });

      await parsePromise;

      // Bulk create trials
      const createdTrials = await storage.bulkCreateTrials(trials);

      // Clean up uploaded file
      fs.unlinkSync(filePath);

      res.json({ 
        success: true, 
        message: `Successfully imported ${createdTrials.length} trials`,
        count: createdTrials.length,
        trials: createdTrials 
      });

    } catch (error) {
      // Clean up file if it exists
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (cleanupError) {
          console.error('Error cleaning up file:', cleanupError);
        }
      }
      
      res.status(500).json({ 
        success: false, 
        error: `Failed to import trials: ${(error as Error).message}` 
      });
    }
  });

<<<<<<< HEAD
  // Patient enrollment route
  app.post("/api/patients/:patientId/enroll/:trialId", async (req, res) => {
    try {
      const patientId = parseInt(req.params.patientId);
      const trialId = parseInt(req.params.trialId);
      
      const patient = await storage.getPatient(patientId);
      const trial = await storage.getClinicalTrial(trialId);
      
      if (!patient || !trial) {
        return res.status(404).json({ success: false, error: "Patient or trial not found" });
      }
      
      // Check if patient has a compatible match for this trial
      const matches = await storage.getTrialMatchesByPatientId(patientId);
      const trialMatch = matches.find(match => match.trialId === trialId);
      
      if (!trialMatch || trialMatch.matchScore < 50) {
        return res.status(400).json({ 
          success: false, 
          error: "Patient is not eligible for this trial based on matching criteria" 
        });
      }
      
      console.log(`✓ Patient ${patient.firstName} ${patient.lastName} enrolled in trial: ${trial.name}`);
      
      res.json({ 
        success: true, 
        message: `Patient ${patient.firstName} ${patient.lastName} successfully enrolled in ${trial.name}`,
        enrollment: {
          patientId,
          trialId,
          enrollmentDate: new Date().toISOString(),
          matchScore: trialMatch.matchScore
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

=======
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190
  const httpServer = createServer(app);
  return httpServer;
}

// Helper functions for digital twin generation
function calculateRiskScore(patient: any): string {
  const stage = patient.cancerStage;
  const age = patient.age;
  
  if (stage === "Stage IV" || age > 75) return "High";
  if (stage === "Stage III" || age > 65) return "Moderate";
  return "Low";
}

function calculateMobility(patient: any): string {
  return patient.age < 65 ? "High" : "Medium";
}

function calculateSupport(patient: any): string {
  // Mock calculation based on location type
  return patient.location.includes("City") ? "Strong" : "Moderate";
}

function calculateCompliance(patient: any): string {
  const treatments = patient.previousTreatments.length;
  if (treatments === 0) return "90%";
  if (treatments <= 2) return "85%";
  return "80%";
}

function calculateMotivation(patient: any): string {
  return patient.cancerStage === "Stage IV" ? "High" : "Medium";
}

function calculateAvailability(patient: any): string {
  return patient.travelWillingness === "Willing to travel anywhere" ? "Flexible" : "Limited";
}

function calculateTechComfort(patient: any): string {
  return patient.age < 50 ? "High" : "Medium";
}

function calculateEngagementScore(patient: any): number {
  let score = 50; // Base score
  
  // Age factor
  if (patient.age < 65) score += 10;
  else if (patient.age > 75) score -= 10;
  
  // Stage factor
  if (patient.cancerStage === "Stage I" || patient.cancerStage === "Stage II") score += 15;
  else if (patient.cancerStage === "Stage IV") score += 20; // High motivation
  
  // Performance status factor
  if (patient.performanceStatus === "Excellent") score += 10;
  else if (patient.performanceStatus === "Poor") score -= 15;
  
  // Travel willingness factor
  if (patient.travelWillingness === "Willing to travel anywhere") score += 15;
  else if (patient.travelWillingness === "Within 25 miles") score -= 5;
  
  // Previous treatments factor (experience with medical system)
  if (patient.previousTreatments.length > 0) score += 5;
  
  return Math.max(0, Math.min(100, score));
}

<<<<<<< HEAD
// Cancer type-focused trial matching algorithm
function generateTrialMatches(patient: any, trials: any[]): any[] {
  const matches = [];
  
  console.log(`\n🔍 Starting trial matching for patient: ${patient.firstName} ${patient.lastName}`);
  console.log(`Patient diagnosis: "${patient.primaryDiagnosis}"`);
  console.log(`Total trials to check: ${trials.length}`);
  
  for (const trial of trials) {
    // CRITICAL: First check cancer type compatibility
    const cancerTypeMatch = calculateCancerTypeMatch(patient.primaryDiagnosis, trial);
    
    console.log(`Trial "${trial.name}": Compatible=${cancerTypeMatch.isCompatible}, Score=${cancerTypeMatch.score}`);
    
    // Only proceed with scoring if cancer types are compatible
    if (!cancerTypeMatch.isCompatible) {
      console.log(`❌ Skipping trial "${trial.name}" - cancer type mismatch`);
      continue; // Skip this trial entirely if cancer types don't match
    }
    
    console.log(`✅ Processing trial "${trial.name}" - cancer type compatible`);
    
=======
// Simple trial matching algorithm
function generateTrialMatches(patient: any, trials: any[]): any[] {
  const matches = [];
  
  for (const trial of trials) {
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190
    const biomarkerScore = calculateBiomarkerMatch(patient.biomarkers, trial.inclusionCriteria?.biomarkers || []);
    const locationScore = calculateLocationMatch(patient.location, trial.location, patient.travelWillingness);
    const burdenScore = calculateBurdenMatch(patient.age, patient.cancerStage, trial.treatmentBurden || "Medium");
    
<<<<<<< HEAD
    // Cancer type compatibility gets high weight in overall score
    const cancerTypeScore = cancerTypeMatch.score;
    const matchScore = Math.round((cancerTypeScore * 0.5 + biomarkerScore * 0.25 + locationScore * 0.15 + burdenScore * 0.1));
    
    // Only include trials with reasonable match scores AND cancer type compatibility
    if (matchScore > 40) {
      matches.push({
        trialId: trial.id,
        matchScore,
        cancerTypeScore,
        biomarkerScore,
        locationScore,
        burdenScore,
        completionLikelihood: matchScore > 75 ? "High" : matchScore > 55 ? "Medium" : "Low",
        explanationFactors: {
          positive: [
            { factor: "Cancer Type Match", impact: cancerTypeScore, description: cancerTypeMatch.explanation },
=======
    // Calculate overall match score
    const matchScore = Math.round((biomarkerScore * 0.4 + locationScore * 0.3 + burdenScore * 0.3));
    
    // Only include trials with reasonable match scores
    if (matchScore > 30) {
      matches.push({
        trialId: trial.id,
        matchScore,
        biomarkerScore,
        locationScore,
        burdenScore,
        completionLikelihood: matchScore > 70 ? "High" : matchScore > 50 ? "Medium" : "Low",
        explanationFactors: {
          positive: [
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190
            { factor: "Biomarker Compatibility", impact: biomarkerScore, description: "Patient biomarkers align with trial requirements" },
            { factor: "Geographic Accessibility", impact: locationScore, description: "Trial location is accessible to patient" },
            { factor: "Treatment Burden", impact: burdenScore, description: "Treatment complexity matches patient capability" }
          ].filter(f => f.impact > 60),
          negative: [
<<<<<<< HEAD
            { factor: "Cancer Type Mismatch", impact: 100 - cancerTypeScore, description: "Limited cancer type compatibility" },
=======
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190
            { factor: "Biomarker Mismatch", impact: 100 - biomarkerScore, description: "Limited biomarker compatibility" },
            { factor: "Distance Concerns", impact: 100 - locationScore, description: "Trial location may be challenging to access" },
            { factor: "Treatment Complexity", impact: 100 - burdenScore, description: "Treatment may be demanding for patient" }
          ].filter(f => f.impact > 40)
        }
      });
    }
  }
  
  // Sort by match score and return top 5
<<<<<<< HEAD
  const sortedMatches = matches.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
  
  console.log(`\n📊 Final matching results for ${patient.firstName} ${patient.lastName}:`);
  console.log(`Total compatible trials found: ${matches.length}`);
  console.log(`Returning top ${sortedMatches.length} matches`);
  sortedMatches.forEach((match, index) => {
    console.log(`${index + 1}. Trial ID ${match.trialId}: Score ${match.matchScore}%`);
  });
  
  return sortedMatches;
}

function calculateCancerTypeMatch(patientDiagnosis: string, trial: any): { isCompatible: boolean, score: number, explanation: string } {
  if (!patientDiagnosis || !trial) {
    return { isCompatible: false, score: 0, explanation: "Missing diagnosis or trial information" };
  }

  const patientCancer = patientDiagnosis.toLowerCase();
  console.log(`\n=== Cancer Type Matching Debug ===`);
  console.log(`Patient diagnosis: "${patientDiagnosis}"`);
  console.log(`Trial name: "${trial.name}"`);
  console.log(`Trial indication: "${trial.indication || 'N/A'}"`);
  console.log(`Trial description: "${trial.description || 'N/A'}"`);
  
  
  // Extract cancer type from trial name and description
  const trialName = (trial.name || "").toLowerCase();
  const trialDescription = (trial.description || "").toLowerCase();
  const trialIndication = (trial.indication || "").toLowerCase();
  
  // Define cancer type mappings for better matching
  const cancerTypeAliases = {
    'breast': ['breast', 'mammary'],
    'lung': ['lung', 'pulmonary', 'bronchial', 'nsclc', 'sclc'],
    'colon': ['colon', 'colorectal', 'rectal', 'bowel'],
    'prostate': ['prostate'],
    'ovarian': ['ovarian', 'ovary'],
    'pancreatic': ['pancreatic', 'pancreas'],
    'kidney': ['kidney', 'renal'],
    'liver': ['liver', 'hepatic'],
    'stomach': ['stomach', 'gastric'],
    'bladder': ['bladder'],
    'brain': ['brain', 'glioma', 'glioblastoma'],
    'lymphoma': ['lymphoma', 'hodgkin', 'non-hodgkin'],
    'leukemia': ['leukemia', 'aml', 'all', 'cml', 'cll'],
    'melanoma': ['melanoma', 'skin'],
    'sarcoma': ['sarcoma'],
    'thyroid': ['thyroid']
  };

  // Find the patient's cancer type
  let patientCancerType = null;
  for (const [baseType, aliases] of Object.entries(cancerTypeAliases)) {
    if (aliases.some(alias => patientCancer.includes(alias))) {
      patientCancerType = baseType;
      break;
    }
  }

  if (!patientCancerType) {
    return { isCompatible: false, score: 20, explanation: "Patient cancer type not recognized" };
  }

  // Check if trial targets the same cancer type
  const trialText = `${trialName} ${trialDescription} ${trialIndication}`;
  const patientAliases = cancerTypeAliases[patientCancerType];
  
  const hasExactMatch = patientAliases.some(alias => trialText.includes(alias));
  
  if (hasExactMatch) {
    console.log(`✓ EXACT MATCH FOUND for ${patientCancerType} cancer`);
    return { 
      isCompatible: true, 
      score: 95, 
      explanation: `Perfect match: Trial specifically targets ${patientCancerType} cancer` 
    };
  }

  // Check for related cancer types (e.g., colorectal includes colon)
  const relatedMatches = {
    'colon': ['colorectal'],
    'lung': ['thoracic'],
    'brain': ['central nervous system', 'cns'],
    'kidney': ['genitourinary'],
    'prostate': ['genitourinary'],
    'bladder': ['genitourinary']
  };

  if (relatedMatches[patientCancerType]) {
    const hasRelatedMatch = relatedMatches[patientCancerType].some(related => 
      trialText.includes(related)
    );
    if (hasRelatedMatch) {
      return { 
        isCompatible: true, 
        score: 80, 
        explanation: `Good match: Trial targets related cancer category for ${patientCancerType} cancer` 
      };
    }
  }

  // STRICT FILTERING: Only allow trials that specifically mention the patient's cancer type
  // Remove the general oncology catch-all that was causing false matches
  console.log(`✗ NO MATCH: Trial does not target ${patientCancerType} cancer`);
  return { 
    isCompatible: false, 
    score: 10, 
    explanation: `No match: Trial does not target ${patientCancerType} cancer` 
  };
=======
  return matches.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190
}

function calculateBiomarkerMatch(patientBiomarkers: any, trialBiomarkers: string[]): number {
  if (!patientBiomarkers || Object.keys(patientBiomarkers).length === 0) return 40; // Default for unknown
  if (!trialBiomarkers || trialBiomarkers.length === 0) return 60; // Default for no specific requirements
  
  const patientMarkers = Object.keys(patientBiomarkers);
  const matches = trialBiomarkers.filter(marker => 
    patientMarkers.some(pMarker => 
      pMarker.toLowerCase().includes(marker.toLowerCase()) || 
      marker.toLowerCase().includes(pMarker.toLowerCase())
    )
  );
  
  return Math.min(95, Math.max(20, (matches.length / trialBiomarkers.length) * 100));
}

function calculateLocationMatch(patientLocation: string, trialLocation: string, travelWillingness: string): number {
  if (!patientLocation || !trialLocation) return 50; // Default for unknown locations
  
  const patientLoc = patientLocation.toLowerCase();
  const trialLoc = trialLocation.toLowerCase();
  
  // Same city/state
  if (patientLoc.includes(trialLoc) || trialLoc.includes(patientLoc)) return 95;
  
  // Travel willingness factor
  if (travelWillingness === "Willing to travel anywhere") return 85;
  if (travelWillingness === "Within 100 miles") return 70;
  if (travelWillingness === "Within 50 miles") return 55;
  if (travelWillingness === "Within 25 miles") return 40;
  
  return 30; // Default for mismatched locations
}

function calculateBurdenMatch(age: number, stage: string, treatmentBurden: string): number {
  let score = 70; // Base score
  
  // Age factor
  if (age > 75 && treatmentBurden === "High") score -= 25;
  else if (age < 50 && treatmentBurden === "High") score += 15;
  
  // Stage factor
  if (stage === "Stage IV" && treatmentBurden === "Low") score -= 15; // May need aggressive treatment
  else if (stage === "Stage I" && treatmentBurden === "High") score -= 10; // May be unnecessary
  
  return Math.max(20, Math.min(95, score));
}

// AI integration functions
async function runAIMatching(patient: any, trials: any[]): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), 'server', 'ai', 'matching.py');
    const pythonProcess = spawn('python3', [scriptPath]);
    
    let output = '';
    let error = '';
    
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`AI matching failed: ${error}`));
        return;
      }
      
      try {
        const result = JSON.parse(output);
        if (result.success) {
          resolve(result.matches);
        } else {
          reject(new Error(result.error));
        }
      } catch (e) {
        reject(new Error(`Failed to parse AI response: ${e.message}`));
      }
    });
    
    // Send input data to Python process
    pythonProcess.stdin.write(JSON.stringify({ patient, trials }));
    pythonProcess.stdin.end();
  });
}

async function runExplainabilityAnalysis(matches: any[], patient: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), 'server', 'ai', 'explainability.py');
    const pythonProcess = spawn('python3', [scriptPath]);
    
    let output = '';
    let error = '';
    
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Explainability analysis failed: ${error}`));
        return;
      }
      
      try {
        const result = JSON.parse(output);
        if (result.success) {
          resolve(result.explainability);
        } else {
          reject(new Error(result.error));
        }
      } catch (e) {
        reject(new Error(`Failed to parse explainability response: ${e.message}`));
      }
    });
    
    // Send input data to Python process
    pythonProcess.stdin.write(JSON.stringify({ matches, patient }));
    pythonProcess.stdin.end();
  });
}
