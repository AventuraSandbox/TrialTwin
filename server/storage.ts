import { 
  patients, 
  digitalTwins, 
  clinicalTrials, 
  trialMatches,
  users,
  type Patient,
  type InsertPatient,
  type DigitalTwin,
  type InsertDigitalTwin,
  type ClinicalTrial,
  type InsertClinicalTrial,
  type TrialMatch,
  type InsertTrialMatch,
  type User,
  type InsertUser,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import createMemoryStore from "memorystore";
import { pool } from "./db";

export interface IStorage {
  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  
  // Patient operations
  createPatient(patient: InsertPatient): Promise<Patient>;
  getPatient(id: number): Promise<Patient | undefined>;
  getAllPatients(): Promise<Patient[]>;
  bulkCreatePatients(patients: InsertPatient[]): Promise<Patient[]>;
  
  // Digital Twin operations
  createDigitalTwin(twin: InsertDigitalTwin): Promise<DigitalTwin>;
  getDigitalTwinByPatientId(patientId: number): Promise<DigitalTwin | undefined>;
  
  // Clinical Trial operations
  getAllClinicalTrials(): Promise<ClinicalTrial[]>;
  getClinicalTrial(id: number): Promise<ClinicalTrial | undefined>;
  createClinicalTrial(trial: InsertClinicalTrial): Promise<ClinicalTrial>;
  bulkCreateTrials(trials: InsertClinicalTrial[]): Promise<ClinicalTrial[]>;
  
  // Trial Match operations
  createTrialMatch(match: InsertTrialMatch): Promise<TrialMatch>;
  getTrialMatchesByPatientId(patientId: number): Promise<TrialMatch[]>;
  
  // Dashboard metrics
  getDashboardMetrics(): Promise<{
    activePatients: number;
    trialMatches: number;
    enrollmentRate: number;
    avgMatchScore: number;
  }>;
  
  // Session store for authentication
  sessionStore: session.Store;
}

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  public sessionStore: session.Store;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
    this.initializeMockTrials().catch(err => console.error('Error initializing trials:', err));
    this.initializeDefaultUser().catch(err => console.error('Error initializing user:', err));
  }

  private async initializeMockTrials() {
    try {
      // Check if trials already exist
      const existingTrials = await db.select().from(clinicalTrials).limit(1);
      if (existingTrials.length > 0) {
        return; // Trials already initialized
      }

      // Initialize with oncology-focused clinical trials
      const mockTrials: Array<Omit<ClinicalTrial, 'id' | 'createdAt'>> = [
        {
          name: "HER2+ Breast Cancer Immunotherapy Trial",
          sponsor: "Oncology Research Institute",
          phase: "Phase II",
          location: "Boston, MA",
          currentEnrollment: 15,
          maxEnrollment: 50,
          inclusionCriteria: {
            biomarkers: ["HER2+"],
            cancerTypes: ["Breast Cancer"],
            stages: ["Stage II", "Stage III"],
            ageRange: { min: 18, max: 75 }
          },
          exclusionCriteria: ["Previous HER2 targeted therapy", "Cardiac dysfunction"],
          treatmentBurden: "Medium",
          travelBurden: "Low",
          description: "A Phase II study evaluating the efficacy of novel immunotherapy in HER2+ breast cancer patients.",
          isActive: true
        },
        {
          name: "Advanced Breast Cancer Combination Therapy",
          sponsor: "BioPharma Solutions",
          phase: "Phase III",
          location: "Cambridge, MA",
          currentEnrollment: 28,
          maxEnrollment: 75,
          inclusionCriteria: {
            biomarkers: ["ER+", "PR+"],
            cancerTypes: ["Breast Cancer"],
            stages: ["Stage III", "Stage IV"],
            ageRange: { min: 21, max: 80 }
          },
          exclusionCriteria: ["Previous hormone therapy", "Liver dysfunction"],
          treatmentBurden: "High",
          travelBurden: "Medium",
          description: "A Phase III trial comparing combination therapy versus standard of care in advanced breast cancer.",
          isActive: true
        },
        {
          name: "Precision Oncology Biomarker Study",
          sponsor: "Genomic Medicine Center",
          phase: "Phase I",
          location: "Providence, RI",
          currentEnrollment: 8,
          maxEnrollment: 25,
          inclusionCriteria: {
            biomarkers: ["BRCA1", "BRCA2", "PIK3CA"],
            cancerTypes: ["Breast Cancer", "Ovarian Cancer"],
            stages: ["Stage I", "Stage II"],
            ageRange: { min: 25, max: 65 }
          },
          exclusionCriteria: ["Previous targeted therapy", "Significant comorbidities"],
          treatmentBurden: "Low",
          travelBurden: "High",
          description: "A precision medicine study targeting specific biomarkers in breast and ovarian cancers.",
          isActive: true
        }
      ];

      // Add mock trials to the database
      for (const trial of mockTrials) {
        await db.insert(clinicalTrials).values(trial).onConflictDoNothing();
      }
    } catch (error) {
      console.error('Error initializing mock trials:', error);
    }
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const [patient] = await db
      .insert(patients)
      .values(insertPatient)
      .returning();
    return patient;
  }

  async getPatient(id: number): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient || undefined;
  }

  async getAllPatients(): Promise<Patient[]> {
    return await db.select().from(patients).orderBy(desc(patients.createdAt));
  }

  async createDigitalTwin(insertTwin: InsertDigitalTwin): Promise<DigitalTwin> {
    const [twin] = await db
      .insert(digitalTwins)
      .values(insertTwin)
      .returning();
    return twin;
  }

  async getDigitalTwinByPatientId(patientId: number): Promise<DigitalTwin | undefined> {
    const [twin] = await db
      .select()
      .from(digitalTwins)
      .where(eq(digitalTwins.patientId, patientId));
    return twin || undefined;
  }

  async getAllClinicalTrials(): Promise<ClinicalTrial[]> {
    return await db
      .select()
      .from(clinicalTrials)
      .where(eq(clinicalTrials.isActive, true))
      .orderBy(desc(clinicalTrials.createdAt));
  }

  async getClinicalTrial(id: number): Promise<ClinicalTrial | undefined> {
    const [trial] = await db
      .select()
      .from(clinicalTrials)
      .where(eq(clinicalTrials.id, id));
    return trial || undefined;
  }

  async createClinicalTrial(insertTrial: InsertClinicalTrial): Promise<ClinicalTrial> {
    const [trial] = await db
      .insert(clinicalTrials)
      .values(insertTrial)
      .returning();
    return trial;
  }

  async createTrialMatch(insertMatch: InsertTrialMatch): Promise<TrialMatch> {
    const [match] = await db
      .insert(trialMatches)
      .values(insertMatch)
      .returning();
    return match;
  }

  async getTrialMatchesByPatientId(patientId: number): Promise<TrialMatch[]> {
    return await db
      .select()
      .from(trialMatches)
      .where(eq(trialMatches.patientId, patientId))
      .orderBy(desc(trialMatches.matchScore));
  }

  async getDashboardMetrics(): Promise<{
    activePatients: number;
    trialMatches: number;
    enrollmentRate: number;
    avgMatchScore: number;
  }> {
    const allPatients = await db.select().from(patients);
    const allMatches = await db.select().from(trialMatches);
    
    const activePatients = allPatients.length;
    const totalMatches = allMatches.length;
    const avgMatchScore = allMatches.length > 0 
      ? allMatches.reduce((sum, match) => sum + match.matchScore, 0) / allMatches.length 
      : 0;

    return {
      activePatients,
      trialMatches: totalMatches,
      enrollmentRate: 78.5, // Mock enrollment rate
      avgMatchScore: Math.round(avgMatchScore)
    };
  }

  // User management methods
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user || undefined;
  }

  async bulkCreatePatients(insertPatients: InsertPatient[]): Promise<Patient[]> {
    const createdPatients: Patient[] = [];
    
    for (const patient of insertPatients) {
      try {
        const [createdPatient] = await db
          .insert(patients)
          .values(patient)
          .returning();
        createdPatients.push(createdPatient);
      } catch (error) {
        console.error('Error creating patient:', error);
      }
    }
    
    return createdPatients;
  }

  private async initializeDefaultUser() {
    try {
      // Check if default user already exists
      const existingUser = await this.getUserByUsername("admin");
      if (existingUser) {
        return; // User already exists
      }

      // Create default user with properly hashed password
<<<<<<< HEAD
      // This will create a user with username "admin" and password "password"
=======
      // IMPORTANT: Replace with secure password in production
      // This will create a user with username "admin" and password from environment
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190
      const { scrypt, randomBytes } = await import("crypto");
      const { promisify } = await import("util");
      const scryptAsync = promisify(scrypt);
      
<<<<<<< HEAD
      const password = "password";
=======
      const password = process.env.ADMIN_PASSWORD || "REPLACE_WITH_SECURE_ADMIN_PASSWORD";
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190
      const salt = randomBytes(16).toString("hex");
      const buf = (await scryptAsync(password, salt, 64)) as Buffer;
      const hashedPassword = `${buf.toString("hex")}.${salt}`;

      await this.createUser({
        username: "admin",
        password: hashedPassword
      });
      
      console.log("Default admin user created successfully");
    } catch (error) {
      console.error("Failed to initialize default user:", error);
    }
  }
}

// Use memory storage for now to avoid database connection issues
export class MemStorage implements IStorage {
  private patients: Patient[] = [];
  private digitalTwins: DigitalTwin[] = [];
  private trials: ClinicalTrial[] = [];
  private matches: TrialMatch[] = [];
  private users: User[] = [];
  public sessionStore: session.Store;
  
  constructor() {
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    this.initializeMockData();
  }
  
  private initializeMockData() {
    // Initialize default user with simple password for development
<<<<<<< HEAD
    this.users.push({
      id: 1,
      username: "admin", 
      password: "password",
=======
    // IMPORTANT: Replace with secure password in production
    this.users.push({
      id: 1,
      username: "admin", 
      password: process.env.ADMIN_PASSWORD || "REPLACE_WITH_SECURE_ADMIN_PASSWORD",
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190
      createdAt: new Date()
    });
    
    // Initialize mock patients
    this.patients = [
      {
        id: 1,
        firstName: "Sarah",
        lastName: "Johnson", 
        age: 45,
        gender: "Female",
        primaryDiagnosis: "Breast Cancer",
        cancerStage: "Stage II",
        previousTreatments: ["Chemotherapy", "Radiation"],
        location: "Boston, MA",
        travelWillingness: "High",
        biomarkers: { HER2: "Positive", BRCA1: "Negative" },
        performanceStatus: "Good",
        email: "sarah.johnson@email.com",
        phone: "(555) 123-4567",
        emergencyContact: "Mark Johnson (husband) - (555) 987-6543",
        createdAt: new Date()
      },
      {
        id: 2,
        firstName: "Michael",
        lastName: "Chen",
        age: 62,
        gender: "Male", 
        primaryDiagnosis: "Lung Cancer",
        cancerStage: "Stage III",
        previousTreatments: ["Surgery", "Chemotherapy"],
        location: "New York, NY",
        travelWillingness: "Medium",
        biomarkers: { EGFR: "Positive", ALK: "Negative" },
        performanceStatus: "Fair",
        email: "michael.chen@email.com",
        phone: "(555) 234-5678",
        emergencyContact: "Linda Chen (wife) - (555) 876-5432",
        createdAt: new Date()
      }
    ];
    
    // Initialize mock trials
    this.trials = [
      {
        id: 1,
        name: "Advanced Breast Cancer Trial",
        sponsor: "Oncology Research Institute",
        phase: "Phase III",
        location: "Boston, MA",
        currentEnrollment: 45,
        maxEnrollment: 100,
        inclusionCriteria: {
          biomarkers: ["HER2", "BRCA1"],
          cancerTypes: ["Breast Cancer"],
          stages: ["Stage II", "Stage III"],
          ageRange: { min: 18, max: 75 }
        },
        exclusionCriteria: ["Previous targeted therapy"],
        treatmentBurden: "High",
        travelBurden: "Low",
        description: "Advanced breast cancer treatment study",
        isActive: true,
        createdAt: new Date()
      }
    ];
    
    // Initialize mock matches
    this.matches = [
      {
        id: 1,
        patientId: 1,
        trialId: 1,
        matchScore: 85,
        biomarkerScore: 90,
        locationScore: 95,
        burdenScore: 75,
        completionLikelihood: "High",
        explanationFactors: {
          positive: [
            { factor: "biomarkers", impact: 90, description: "Strong HER2 compatibility" },
            { factor: "location", impact: 95, description: "Perfect location match" }
          ],
          negative: [
            { factor: "burden", impact: 75, description: "High treatment burden" }
          ]
        },
        createdAt: new Date()
      }
    ];
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const newUser = { ...user, id: this.users.length + 1, createdAt: new Date() };
    this.users.push(newUser);
    return newUser;
  }
  
  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }
  
  async createPatient(patient: InsertPatient): Promise<Patient> {
    const newPatient = { ...patient, id: this.patients.length + 1, createdAt: new Date() };
    this.patients.push(newPatient);
    return newPatient;
  }
  
  async getPatient(id: number): Promise<Patient | undefined> {
    return this.patients.find(p => p.id === id);
  }
  
  async getAllPatients(): Promise<Patient[]> {
    return this.patients;
  }
  
  async bulkCreatePatients(patients: InsertPatient[]): Promise<Patient[]> {
    const created = patients.map((p, index) => ({
      ...p,
      id: this.patients.length + index + 1,
      createdAt: new Date()
    }));
    this.patients.push(...created);
    return created;
  }

  async bulkCreateTrials(trials: InsertClinicalTrial[]): Promise<ClinicalTrial[]> {
    const created = trials.map((t, index) => ({
      ...t,
      id: this.trials.length + index + 1,
      createdAt: new Date()
    }));
    this.trials.push(...created);
    return created;
  }
  
  async createDigitalTwin(twin: InsertDigitalTwin): Promise<DigitalTwin> {
    const newTwin = { ...twin, id: this.digitalTwins.length + 1, createdAt: new Date() };
    this.digitalTwins.push(newTwin);
    return newTwin;
  }
  
  async getDigitalTwinByPatientId(patientId: number): Promise<DigitalTwin | undefined> {
    return this.digitalTwins.find(t => t.patientId === patientId);
  }
  
  async getAllClinicalTrials(): Promise<ClinicalTrial[]> {
    return this.trials;
  }
  
  async getClinicalTrial(id: number): Promise<ClinicalTrial | undefined> {
    return this.trials.find(t => t.id === id);
  }
  
  async createClinicalTrial(trial: InsertClinicalTrial): Promise<ClinicalTrial> {
    const newTrial = { ...trial, id: this.trials.length + 1, createdAt: new Date() };
    this.trials.push(newTrial);
    return newTrial;
  }
  
  async createTrialMatch(match: InsertTrialMatch): Promise<TrialMatch> {
    const newMatch = { ...match, id: this.matches.length + 1, createdAt: new Date() };
    this.matches.push(newMatch);
    return newMatch;
  }
  
  async getTrialMatchesByPatientId(patientId: number): Promise<TrialMatch[]> {
    return this.matches.filter(m => m.patientId === patientId);
  }
  
  async getDashboardMetrics(): Promise<{
    activePatients: number;
    trialMatches: number;
    enrollmentRate: number;
    avgMatchScore: number;
  }> {
    const avgMatchScore = this.matches.length > 0 
      ? this.matches.reduce((sum, m) => sum + m.matchScore, 0) / this.matches.length
      : 0;
      
    return {
      activePatients: this.patients.length,
      trialMatches: this.matches.length,
      enrollmentRate: 75,
      avgMatchScore: Math.round(avgMatchScore)
    };
  }
}

export const storage = new MemStorage();