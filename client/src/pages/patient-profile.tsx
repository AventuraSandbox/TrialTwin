import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/ui/header";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Calendar,
  Heart,
  Zap,
  Target,
  ArrowLeft,
  Activity,
  Users,
  Clock
} from "lucide-react";
import { Link } from "wouter";

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  primaryDiagnosis: string;
  cancerStage: string;
  previousTreatments: string[];
  location: string;
  travelWillingness: string;
  biomarkers: Record<string, string>;
  performanceStatus: string;
  email?: string;
  phone?: string;
  emergencyContact?: string;
  createdAt: string;
}

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

interface TrialMatch {
  id: number;
  patientId: number;
  trialId: number;
  matchScore: number;
  biomarkerScore: number;
  locationScore: number;
  burdenScore: number;
  completionLikelihood: string;
  explanationFactors: {
    positive: Array<{ factor: string; impact: number; description: string }>;
    negative: Array<{ factor: string; impact: number; description: string }>;
  };
}

interface ClinicalTrial {
  id: number;
  name: string;
  sponsor: string;
  phase: string;
  location: string;
  description: string;
  currentEnrollment: number;
  maxEnrollment: number;
  treatmentBurden: string;
  travelBurden: string;
  isActive: boolean;
}

export default function PatientProfile() {
  const { id } = useParams<{ id: string }>();
  const patientId = parseInt(id || "0");

  const { data: patient, isLoading: patientLoading } = useQuery<Patient>({
    queryKey: ["/api/patients", patientId],
  });

  const { data: digitalTwin, isLoading: twinLoading } = useQuery<DigitalTwin>({
    queryKey: ["/api/digital-twins/patient", patientId],
  });

  const { data: matches, isLoading: matchesLoading } = useQuery<TrialMatch[]>({
    queryKey: ["/api/trial-matches/patient", patientId],
  });

  const { data: trials, isLoading: trialsLoading } = useQuery<ClinicalTrial[]>({
    queryKey: ["/api/clinical-trials"],
  });

  if (patientLoading || twinLoading || matchesLoading || trialsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-500">Patient not found.</p>
            <Link to="/patient-list">
              <Button className="mt-4">Back to Patient List</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getTrialById = (trialId: number) => {
    return trials?.find(t => t.id === trialId);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getRiskColor = (risk: string) => {
    if (risk === "Low") return "bg-green-100 text-green-800";
    if (risk === "Medium") return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getEngagementColor = (level: string) => {
    if (level === "High") return "bg-green-100 text-green-800";
    if (level === "Medium") return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/patient-list">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Patient List
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {patient.firstName} {patient.lastName}
              </h1>
              <p className="text-gray-600">
                {patient.age} years old • {patient.gender} • Patient ID: {patient.id}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                Added: {new Date(patient.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="medical">Medical History</TabsTrigger>
            <TabsTrigger value="digital-twin">Digital Twin</TabsTrigger>
            <TabsTrigger value="trial-matches">Trial Matches</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {patient.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{patient.email}</span>
                    </div>
                  )}
                  {patient.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{patient.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{patient.location}</span>
                  </div>
                  {patient.emergencyContact && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>Emergency: {patient.emergencyContact}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-gray-500" />
                    <span>Travel: {patient.travelWillingness}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Current Diagnosis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Current Diagnosis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium text-lg">{patient.primaryDiagnosis}</p>
                    <p className="text-gray-600">Stage: {patient.cancerStage}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Performance Status</p>
                    <Badge className={getRiskColor(patient.performanceStatus)}>
                      {patient.performanceStatus}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Trial Matching Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Trial Matching Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {matches && matches.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Total Matches</span>
                        <Badge variant="outline">{matches.length}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Eligible Trials</span>
                        <Badge variant="outline">
                          {matches.filter(m => m.matchScore >= 60).length}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Average Score</span>
                        <Badge className={getScoreColor(
                          Math.round(matches.reduce((sum, m) => sum + m.matchScore, 0) / matches.length)
                        )}>
                          {Math.round(matches.reduce((sum, m) => sum + m.matchScore, 0) / matches.length)}%
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Best Match</span>
                        <Badge className={getScoreColor(Math.max(...matches.map(m => m.matchScore)))}>
                          {Math.max(...matches.map(m => m.matchScore))}%
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No trial matches found</p>
                  )}
                </CardContent>
              </Card>

              {/* Biomarkers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Biomarkers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    {patient.biomarkers && Object.entries(patient.biomarkers).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-sm">{key}</span>
                        <Badge variant="secondary">{value}</Badge>
                      </div>
                    ))}
                    {(!patient.biomarkers || Object.keys(patient.biomarkers).length === 0) && (
                      <p className="text-gray-500">No biomarkers available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="medical">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Medical History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Previous Treatments</h3>
                  <div className="space-y-2">
                    {patient.previousTreatments && patient.previousTreatments.length > 0 ? (
                      patient.previousTreatments.map((treatment, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{treatment}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No previous treatments recorded</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Current Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Primary Diagnosis</p>
                      <p className="text-lg">{patient.primaryDiagnosis}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Cancer Stage</p>
                      <Badge className={getRiskColor(patient.cancerStage)}>
                        {patient.cancerStage}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Performance Status</p>
                      <Badge className={getRiskColor(patient.performanceStatus)}>
                        {patient.performanceStatus}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Travel Willingness</p>
                      <Badge variant="outline">{patient.travelWillingness}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="digital-twin">
            {digitalTwin ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Clinical Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Risk Score</span>
                      <Badge className={getRiskColor(digitalTwin.clinicalProfile.riskScore)}>
                        {digitalTwin.clinicalProfile.riskScore}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Biomarkers</span>
                      <Badge variant="secondary">{digitalTwin.clinicalProfile.biomarkers}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Performance</span>
                      <Badge className={getEngagementColor(digitalTwin.clinicalProfile.performance)}>
                        {digitalTwin.clinicalProfile.performance}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Lifestyle Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Mobility</span>
                      <Badge className={getEngagementColor(digitalTwin.lifestyleFactors.mobility)}>
                        {digitalTwin.lifestyleFactors.mobility}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Support</span>
                      <Badge className={getEngagementColor(digitalTwin.lifestyleFactors.support)}>
                        {digitalTwin.lifestyleFactors.support}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Compliance</span>
                      <Badge className={getEngagementColor(digitalTwin.lifestyleFactors.compliance)}>
                        {digitalTwin.lifestyleFactors.compliance}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Engagement Signals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Motivation</span>
                      <Badge className={getEngagementColor(digitalTwin.engagementSignals.motivation)}>
                        {digitalTwin.engagementSignals.motivation}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Availability</span>
                      <Badge className={getEngagementColor(digitalTwin.engagementSignals.availability)}>
                        {digitalTwin.engagementSignals.availability}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Tech Comfort</span>
                      <Badge className={getEngagementColor(digitalTwin.engagementSignals.techComfort)}>
                        {digitalTwin.engagementSignals.techComfort}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">Digital twin profile not available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="trial-matches">
            <div className="space-y-4">
              {matches && matches.length > 0 ? (
                matches
                  .sort((a, b) => b.matchScore - a.matchScore)
                  .map((match) => {
                    const trial = getTrialById(match.trialId);
                    return (
                      <Card key={match.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">
                                {trial?.name || `Trial ${match.trialId}`}
                              </CardTitle>
                              <p className="text-sm text-gray-600">
                                {trial?.sponsor} • {trial?.phase} • {trial?.location}
                              </p>
                            </div>
                            <Badge className={getScoreColor(match.matchScore)}>
                              {match.matchScore}% Match
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div className="text-center">
                              <p className="text-sm font-medium">Biomarker Score</p>
                              <Badge className={getScoreColor(match.biomarkerScore)}>
                                {match.biomarkerScore}%
                              </Badge>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium">Location Score</p>
                              <Badge className={getScoreColor(match.locationScore)}>
                                {match.locationScore}%
                              </Badge>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium">Burden Score</p>
                              <Badge className={getScoreColor(match.burdenScore)}>
                                {match.burdenScore}%
                              </Badge>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium">Completion</p>
                              <Badge variant="outline">{match.completionLikelihood}</Badge>
                            </div>
                          </div>

                          {trial && (
                            <div className="border-t pt-4">
                              <p className="text-sm text-gray-600 mb-2">{trial.description}</p>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">Enrollment:</span> {trial.currentEnrollment}/{trial.maxEnrollment}
                                </div>
                                <div>
                                  <span className="font-medium">Treatment Burden:</span> {trial.treatmentBurden}
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">No trial matches found for this patient</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
}