import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/ui/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Upload, Plus, FileText, MapPin, Calendar, Users } from "lucide-react";

export default function TrialManagement() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    phase: "",
    indication: "",
    location: "",
    eligibilityCriteria: "",
    biomarkers: "",
    estimatedDuration: "",
    treatmentBurden: "Low"
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: trials, isLoading } = useQuery({
    queryKey: ["/api/clinical-trials"],
  });

  const addTrialMutation = useMutation({
    mutationFn: async (trialData: any) => {
      const response = await apiRequest("POST", "/api/clinical-trials", trialData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Trial Added",
        description: "Clinical trial has been successfully added to the system",
      });
      setShowAddForm(false);
      setFormData({
        title: "",
        description: "",
        phase: "",
        indication: "",
        location: "",
        eligibilityCriteria: "",
        biomarkers: "",
        estimatedDuration: "",
        treatmentBurden: "Low"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/clinical-trials"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add trial",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      biomarkers: formData.biomarkers.split(",").map(b => b.trim()).filter(b => b),
      eligibilityCriteria: formData.eligibilityCriteria.split("\n").filter(c => c.trim()),
    };
    addTrialMutation.mutate(processedData);
  };

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('csvFile', file);
      
      const response = await fetch('/api/clinical-trials/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Upload Successful",
        description: `Successfully imported ${data.count} clinical trials`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/clinical-trials"] });
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload clinical trials",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv') {
        toast({
          title: "Invalid File Type",
          description: "Please upload a CSV file",
          variant: "destructive",
        });
        return;
      }
      uploadMutation.mutate(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Clinical Trial Management</h1>
          <p className="text-slate-600">Upload and manage clinical trial information for patient matching</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Trial
          </Button>
          <div className="relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              disabled={uploadMutation.isPending}
            >
              <Upload className="w-4 h-4" />
              {uploadMutation.isPending ? "Uploading..." : "Upload CSV"}
            </Button>
          </div>
        </div>

        {/* Add Trial Form */}
        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Clinical Trial</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Trial Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Enter trial title"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phase">Phase</Label>
                    <Input
                      id="phase"
                      value={formData.phase}
                      onChange={(e) => handleInputChange("phase", e.target.value)}
                      placeholder="Phase I, II, III"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="indication">Indication</Label>
                    <Input
                      id="indication"
                      value={formData.indication}
                      onChange={(e) => handleInputChange("indication", e.target.value)}
                      placeholder="Disease/condition"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="City, State"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Estimated Duration</Label>
                    <Input
                      id="duration"
                      value={formData.estimatedDuration}
                      onChange={(e) => handleInputChange("estimatedDuration", e.target.value)}
                      placeholder="6 months"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="burden">Treatment Burden</Label>
                    <select
                      id="burden"
                      value={formData.treatmentBurden}
                      onChange={(e) => handleInputChange("treatmentBurden", e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Detailed trial description"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="eligibility">Eligibility Criteria (one per line)</Label>
                  <Textarea
                    id="eligibility"
                    value={formData.eligibilityCriteria}
                    onChange={(e) => handleInputChange("eligibilityCriteria", e.target.value)}
                    placeholder="Age 18-75&#10;No prior treatment&#10;Adequate organ function"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="biomarkers">Required Biomarkers (comma-separated)</Label>
                  <Input
                    id="biomarkers"
                    value={formData.biomarkers}
                    onChange={(e) => handleInputChange("biomarkers", e.target.value)}
                    placeholder="PD-L1, EGFR, KRAS"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={addTrialMutation.isPending}>
                    {addTrialMutation.isPending ? "Adding..." : "Add Trial"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Trials List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Active Clinical Trials</h2>
          {isLoading ? (
            <div className="text-center py-8">Loading trials...</div>
          ) : (
            <div className="grid gap-4">
              {trials?.map((trial: any) => (
                <Card key={trial.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{trial.title}</CardTitle>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">{trial.phase}</Badge>
                          <Badge variant="secondary">{trial.indication}</Badge>
                          <Badge className={
                            trial.treatmentBurden === "Low" ? "bg-green-100 text-green-800" :
                            trial.treatmentBurden === "Medium" ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          }>
                            {trial.treatmentBurden} Burden
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin className="w-4 h-4" />
                        {trial.location}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">{trial.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="font-medium">Duration:</span>
                          <span>{trial.estimatedDuration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span className="font-medium">Biomarkers:</span>
                          <span>{trial.biomarkers?.join(", ") || "None specified"}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span className="font-medium">Eligibility:</span>
                          <span>{trial.eligibilityCriteria?.length || 0} criteria</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-green-600" />
                          <span className="font-medium">Eligible Patients:</span>
                          <span className="text-green-600 font-semibold">
                            {trial.eligiblePatients || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}