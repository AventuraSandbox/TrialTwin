import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/ui/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Phone, Mail, MapPin, Calendar, Star, Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { useRef } from "react";
import { useLocation } from "wouter";

export default function PatientRecruiter() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, setLocation] = useLocation();
  
  const { data: patientsData } = useQuery({
    queryKey: ["/api/patients"],
  });

  const { data: metricsData } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
  });

  // Use real patient data from database
  const patients = patientsData || [];

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('csvFile', file);
      
      const response = await fetch('/api/patients/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "CSV Upload Successful",
        description: `Successfully imported ${data.count} patients`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/patients"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      uploadMutation.mutate(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a CSV file",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New Lead": return "bg-blue-100 text-blue-800";
      case "Contacted": return "bg-yellow-100 text-yellow-800";
      case "Interested": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "text-red-600";
      case "Medium": return "text-yellow-600";
      case "Low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Role Banner */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 rounded-full p-3">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Patient Recruiter Dashboard</h1>
                    <p className="text-purple-100">AI-Powered Patient Recruitment & Matching</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    AI-Ranked Patient Lists
                  </Badge>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadMutation.isPending}
                    className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadMutation.isPending ? "Uploading..." : "Upload CSV"}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Active Leads</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {metricsData?.metrics?.activePatients || 0}
                  </p>
                </div>
                <div className="bg-blue-100 rounded-full p-2">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Trial Matches</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {metricsData?.metrics?.trialMatches || 0}
                  </p>
                </div>
                <div className="bg-green-100 rounded-full p-2">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Enrollment Rate</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {metricsData?.metrics?.enrollmentRate || 0}%
                  </p>
                </div>
                <div className="bg-purple-100 rounded-full p-2">
                  <Star className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Avg. Match Score</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {metricsData?.metrics?.avgMatchScore || 0}%
                  </p>
                </div>
                <div className="bg-yellow-100 rounded-full p-2">
                  <Calendar className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>AI-Ranked Patient Candidates</span>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.csv';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        alert(`CSV file "${file.name}" selected for upload. Upload functionality would process this file.`);
                      }
                    };
                    input.click();
                  }}
                >
                  Upload CSV
                </Button>
                <Badge className="bg-purple-100 text-purple-800">
                  Updated 2 min ago
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(patientsData || []).map((patient) => (
                <div key={patient.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{patient.firstName} {patient.lastName}</h3>
                        <Badge className="bg-blue-100 text-blue-800">
                          New Lead
                        </Badge>
                        <span className="text-sm font-medium text-red-600">
                          High Priority
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                        <div>
                          <p><strong>Age:</strong> {patient.age}</p>
                          <p><strong>Diagnosis:</strong> {patient.primaryDiagnosis} ({patient.cancerStage})</p>
                          <p><strong>Biomarkers:</strong> {Object.entries(patient.biomarkers).map(([key, value]) => `${key}: ${value}`).join(", ")}</p>
                        </div>
                        <div>
                          <p className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {patient.location}
                          </p>
                          <p className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            Contact Available
                          </p>
                          <p className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            Email Available
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        92%
                      </div>
                      <p className="text-xs text-slate-500">Match Score</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Last contact: Today
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                    <div className="text-sm text-slate-600">
                      <strong>Next Action:</strong> Schedule screening call
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setLocation(`/patient-profile/${patient.id}`)}
                      >
                        View Profile
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => alert(`Contacting ${patient.firstName} ${patient.lastName}`)}
                      >
                        Contact Patient
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}