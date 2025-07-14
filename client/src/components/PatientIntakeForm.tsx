import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientIntakeSchema, type PatientIntakeForm } from "@shared/schema";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface PatientIntakeFormProps {
  onPatientCreated: (patientId: number) => void;
}

export function PatientIntakeForm({ onPatientCreated }: PatientIntakeFormProps) {
  const [selectedStage, setSelectedStage] = useState<string>("");
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PatientIntakeForm>({
    resolver: zodResolver(patientIntakeSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      age: 0,
      gender: "Male",
      primaryDiagnosis: "",
      cancerStage: "Stage I",
      previousTreatments: [],
      location: "",
      travelWillingness: "",
    },
  });

  const createPatientMutation = useMutation({
    mutationFn: async (data: PatientIntakeForm) => {
      const response = await apiRequest("POST", "/api/patients", {
        ...data,
        previousTreatments: selectedTreatments,
        biomarkers: inferBiomarkers(data.primaryDiagnosis),
        performanceStatus: "ECOG 1",
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Patient Created Successfully",
          description: "Digital twin profile is being generated...",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/patients"] });
<<<<<<< HEAD
        queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
=======
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190
        onPatientCreated(data.patient.id);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create patient",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create patient",
        variant: "destructive",
      });
    },
  });

  const treatmentOptions = [
    "Chemotherapy",
    "Radiation",
    "Surgery",
    "Immunotherapy",
    "Hormone Therapy",
    "Targeted Therapy",
  ];

  const handleTreatmentToggle = (treatment: string) => {
    setSelectedTreatments(prev => 
      prev.includes(treatment) 
        ? prev.filter(t => t !== treatment)
        : [...prev, treatment]
    );
  };

  const handleStageSelect = (stage: string) => {
    setSelectedStage(stage);
    form.setValue("cancerStage", stage as any);
  };

  const onSubmit = (data: PatientIntakeForm) => {
    const formData = {
      ...data,
      previousTreatments: selectedTreatments,
    };
    createPatientMutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Patient Intake</CardTitle>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Step 1 of 3
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormLabel className="text-base font-medium">Patient Information</FormLabel>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="First Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Last Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Years" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="primaryDiagnosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Diagnosis</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Primary Condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Breast Cancer">Breast Cancer</SelectItem>
                      <SelectItem value="Lung Cancer">Lung Cancer</SelectItem>
                      <SelectItem value="Colon Cancer">Colon Cancer</SelectItem>
                      <SelectItem value="Prostate Cancer">Prostate Cancer</SelectItem>
                      <SelectItem value="Melanoma">Melanoma</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="text-sm font-medium mb-2 block">Cancer Stage</FormLabel>
              <div className="grid grid-cols-4 gap-2">
                {["Stage I", "Stage II", "Stage III", "Stage IV"].map((stage) => (
                  <Button
                    key={stage}
                    type="button"
                    variant={selectedStage === stage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStageSelect(stage)}
                    className={selectedStage === stage ? "bg-blue-600" : ""}
                  >
                    {stage}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <FormLabel className="text-sm font-medium mb-2 block">Previous Treatments</FormLabel>
              <div className="space-y-2">
                {treatmentOptions.map((treatment) => (
                  <div key={treatment} className="flex items-center space-x-2">
                    <Checkbox
                      id={treatment}
                      checked={selectedTreatments.includes(treatment)}
                      onCheckedChange={() => handleTreatmentToggle(treatment)}
                    />
                    <label htmlFor={treatment} className="text-sm text-slate-700">
                      {treatment}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Preference</FormLabel>
                  <FormControl>
                    <Input placeholder="City, State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="travelWillingness"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Travel Willingness</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select max distance" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Within 25 miles">Within 25 miles</SelectItem>
                      <SelectItem value="Within 50 miles">Within 50 miles</SelectItem>
                      <SelectItem value="Within 100 miles">Within 100 miles</SelectItem>
                      <SelectItem value="Willing to travel anywhere">Willing to travel anywhere</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={createPatientMutation.isPending}
            >
              {createPatientMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Digital Twin...
                </>
              ) : (
                "Create Digital Twin & Find Matches"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// Helper function to infer biomarkers based on diagnosis
function inferBiomarkers(diagnosis: string): Record<string, string> {
  const biomarkerMap: Record<string, Record<string, string>> = {
    "Breast Cancer": { "HER2": "HER2+", "ER": "ER+", "PR": "PR+" },
    "Lung Cancer": { "EGFR": "EGFR+", "ALK": "ALK+" },
    "Colon Cancer": { "KRAS": "KRAS+", "BRAF": "BRAF+" },
    "Prostate Cancer": { "PSA": "Elevated" },
    "Melanoma": { "BRAF": "BRAF+", "NRAS": "NRAS+" },
  };

  return biomarkerMap[diagnosis] || {};
}
