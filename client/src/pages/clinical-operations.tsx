import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/ui/header";
import { PatientIntakeForm } from "@/components/PatientIntakeForm";
import { DigitalTwinProfile } from "@/components/DigitalTwinProfile";
import { TrialMatchingResults } from "@/components/TrialMatchingResults";
import { ExplainabilityDashboard } from "@/components/ExplainabilityDashboard";
import { ClinicalDashboard } from "@/components/ClinicalDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { User, ChevronRight } from "lucide-react";

export default function ClinicalOperations() {
  const [currentPatientId, setCurrentPatientId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<"intake" | "profile" | "matching">("intake");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createDigitalTwinMutation = useMutation({
    mutationFn: async (patientId: number) => {
      const response = await apiRequest("POST", "/api/digital-twins", { patientId });
      return response.json();
    },
    onSuccess: (data) => {
<<<<<<< HEAD
      console.log("Digital twin creation response:", data);
      if (data.success) {
        // Invalidate digital twin queries to refresh data
        queryClient.invalidateQueries({ queryKey: ["/api/digital-twins"] });
=======
      if (data.success) {
        setCurrentStep("profile");
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190
        toast({
          title: "Digital Twin Created",
          description: "Patient profile has been generated successfully",
        });
      }
    },
<<<<<<< HEAD
    onError: (error) => {
      console.error("Digital twin creation error:", error);
      toast({
        title: "Error Creating Digital Twin",
        description: "There was a problem generating the patient profile",
        variant: "destructive",
      });
    },
=======
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190
  });

  const generateMatchesMutation = useMutation({
    mutationFn: async (patientId: number) => {
      const response = await apiRequest("POST", "/api/trial-matches", { patientId });
      return response.json();
    },
    onSuccess: (data) => {
<<<<<<< HEAD
      console.log("Trial matches response:", data);
      if (data.success) {
        setCurrentStep("matching");
        toast({
          title: "Complete Workflow Finished",
          description: `Patient profile, digital twin, and ${data.matches.length} trial matches generated successfully`,
        });
        // Invalidate all relevant queries to refresh data
        queryClient.invalidateQueries({ queryKey: ["/api/trial-matches"] });
        queryClient.invalidateQueries({ queryKey: ["/api/digital-twins"] });
        queryClient.invalidateQueries({ queryKey: ["/api/patients"] });
      }
    },
    onError: (error) => {
      console.error("Trial matching error:", error);
      toast({
        title: "Error Generating Matches",
        description: "There was a problem finding trial matches",
        variant: "destructive",
      });
    },
  });

  const handlePatientCreated = async (patientId: number) => {
    setCurrentPatientId(patientId);
    // Automatically create digital twin and then generate matches
    try {
      await createDigitalTwinMutation.mutateAsync(patientId);
      // After digital twin is created, automatically generate matches
      await generateMatchesMutation.mutateAsync(patientId);
    } catch (error) {
      console.error("Error in patient creation workflow:", error);
    }
=======
      if (data.success) {
        setCurrentStep("matching");
        toast({
          title: "Trial Matches Generated",
          description: `Found ${data.matches.length} potential trial matches`,
        });
        queryClient.invalidateQueries({ queryKey: ["/api/trial-matches"] });
      }
    },
  });

  const handlePatientCreated = (patientId: number) => {
    setCurrentPatientId(patientId);
    createDigitalTwinMutation.mutate(patientId);
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190
  };

  const handleGenerateMatches = () => {
    if (currentPatientId) {
      generateMatchesMutation.mutate(currentPatientId);
    }
  };

  const handleStartOver = () => {
    setCurrentPatientId(null);
    setCurrentStep("intake");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Role Banner */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 rounded-full p-3">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Clinical Operations Dashboard</h1>
                    <p className="text-blue-100">Comprehensive Clinical Trial Management</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  Trial Simulation & Compliance
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Steps */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <span className={currentStep === "intake" ? "text-blue-600 font-medium" : ""}>
              1. Patient Intake
            </span>
            <ChevronRight className="h-4 w-4" />
            <span className={currentStep === "profile" ? "text-blue-600 font-medium" : ""}>
              2. Digital Twin Generation
            </span>
            <ChevronRight className="h-4 w-4" />
            <span className={currentStep === "matching" ? "text-blue-600 font-medium" : ""}>
              3. Trial Matching & Analysis
            </span>
          </div>
        </div>

        {currentStep === "intake" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <PatientIntakeForm onPatientCreated={handlePatientCreated} />
            </div>
            <div className="lg:col-span-2">
              <ClinicalDashboard />
            </div>
          </div>
        )}

        {currentStep === "profile" && currentPatientId && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-900">Digital Twin Profile Generated</h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleStartOver}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900"
                >
                  Start Over
                </button>
                <button
                  onClick={handleGenerateMatches}
                  disabled={generateMatchesMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {generateMatchesMutation.isPending ? "Finding Matches..." : "Find Trial Matches"}
                </button>
              </div>
            </div>
            
            <DigitalTwinProfile patientId={currentPatientId} />
            <ClinicalDashboard />
          </div>
        )}

        {currentStep === "matching" && currentPatientId && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-900">Trial Matching Results</h2>
              <button
                onClick={handleStartOver}
                className="px-4 py-2 text-slate-600 hover:text-slate-900"
              >
                Start Over
              </button>
            </div>
            
<<<<<<< HEAD
            {/* Single column layout as requested */}
            <div className="max-w-4xl mx-auto space-y-8">
              <DigitalTwinProfile patientId={currentPatientId} />
              <TrialMatchingResults patientId={currentPatientId} />
              <ExplainabilityDashboard patientId={currentPatientId} />
=======
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <DigitalTwinProfile patientId={currentPatientId} />
              </div>
              <div className="lg:col-span-2 space-y-6">
                <TrialMatchingResults patientId={currentPatientId} />
                <ExplainabilityDashboard patientId={currentPatientId} />
              </div>
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190
            </div>
            
            <ClinicalDashboard />
          </div>
        )}
      </main>
    </div>
  );
}