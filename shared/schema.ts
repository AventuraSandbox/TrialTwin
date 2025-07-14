import { pgTable, text, serial, integer, boolean, jsonb, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Patient table
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  primaryDiagnosis: text("primary_diagnosis").notNull(),
  cancerStage: text("cancer_stage").notNull(),
  previousTreatments: jsonb("previous_treatments").$type<string[]>().notNull(),
  location: text("location").notNull(),
  travelWillingness: text("travel_willingness").notNull(),
  biomarkers: jsonb("biomarkers").$type<Record<string, string>>().notNull(),
  performanceStatus: text("performance_status").notNull(),
  email: text("email"),
  phone: text("phone"),
  emergencyContact: text("emergency_contact"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Digital Twin table
export const digitalTwins = pgTable("digital_twins", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  clinicalProfile: jsonb("clinical_profile").$type<{
    riskScore: string;
    biomarkers: string;
    performance: string;
  }>().notNull(),
  lifestyleFactors: jsonb("lifestyle_factors").$type<{
    mobility: string;
    support: string;
    compliance: string;
  }>().notNull(),
  engagementSignals: jsonb("engagement_signals").$type<{
    motivation: string;
    availability: string;
    techComfort: string;
  }>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Clinical Trials table
export const clinicalTrials = pgTable("clinical_trials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sponsor: text("sponsor").notNull(),
  phase: text("phase").notNull(),
  location: text("location").notNull(),
  currentEnrollment: integer("current_enrollment").notNull(),
  maxEnrollment: integer("max_enrollment").notNull(),
  inclusionCriteria: jsonb("inclusion_criteria").$type<{
    biomarkers: string[];
    cancerTypes: string[];
    stages: string[];
    ageRange: { min: number; max: number };
  }>().notNull(),
  exclusionCriteria: jsonb("exclusion_criteria").$type<string[]>().notNull(),
  treatmentBurden: text("treatment_burden").notNull(), // Low, Medium, High
  travelBurden: text("travel_burden").notNull(), // Low, Medium, High
  description: text("description").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Trial Matches table
export const trialMatches = pgTable("trial_matches", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  trialId: integer("trial_id").references(() => clinicalTrials.id).notNull(),
  matchScore: real("match_score").notNull(), // 0-100
  biomarkerScore: real("biomarker_score").notNull(),
  locationScore: real("location_score").notNull(),
  burdenScore: real("burden_score").notNull(),
  completionLikelihood: text("completion_likelihood").notNull(), // Low, Medium, High
  explanationFactors: jsonb("explanation_factors").$type<{
    positive: Array<{ factor: string; impact: number; description: string }>;
    negative: Array<{ factor: string; impact: number; description: string }>;
  }>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  createdAt: true,
});

export const insertDigitalTwinSchema = createInsertSchema(digitalTwins).omit({
  id: true,
  createdAt: true,
});

export const insertClinicalTrialSchema = createInsertSchema(clinicalTrials).omit({
  id: true,
  createdAt: true,
});

export const insertTrialMatchSchema = createInsertSchema(trialMatches).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type DigitalTwin = typeof digitalTwins.$inferSelect;
export type InsertDigitalTwin = z.infer<typeof insertDigitalTwinSchema>;
export type ClinicalTrial = typeof clinicalTrials.$inferSelect;
export type InsertClinicalTrial = z.infer<typeof insertClinicalTrialSchema>;
export type TrialMatch = typeof trialMatches.$inferSelect;
export type InsertTrialMatch = z.infer<typeof insertTrialMatchSchema>;

// Patient intake form schema
export const patientIntakeSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  age: z.number().min(18, "Must be at least 18 years old").max(100, "Age must be realistic"),
  gender: z.enum(["Male", "Female", "Other"], { required_error: "Gender is required" }),
  primaryDiagnosis: z.string().min(1, "Primary diagnosis is required"),
  cancerStage: z.enum(["Stage I", "Stage II", "Stage III", "Stage IV"], { required_error: "Cancer stage is required" }),
  previousTreatments: z.array(z.string()).min(0),
  location: z.string().min(1, "Location is required"),
  travelWillingness: z.string().min(1, "Travel willingness is required"),
});

export type PatientIntakeForm = z.infer<typeof patientIntakeSchema>;
