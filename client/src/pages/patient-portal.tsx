import { Header } from "@/components/ui/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { User, Calendar, Shield, FileText, CheckCircle, Clock, MapPin } from "lucide-react";

export default function PatientPortal() {
  const mockPatientData = {
    name: "Sarah Johnson",
    age: 48,
    diagnosis: "Breast Cancer",
    stage: "Stage II",
    enrollmentStatus: "Pre-Screening",
    trialMatch: "HER2+ Breast Cancer Immunotherapy Trial",
    matchScore: 92,
    nextAppointment: "2024-01-20",
    completedSteps: 2,
    totalSteps: 5
  };

  const trialSteps = [
    {
      id: 1,
      title: "Initial Screening",
      description: "Complete health questionnaire and consent forms",
      status: "completed",
      date: "2024-01-15"
    },
    {
      id: 2,
      title: "Medical History Review",
      description: "Upload medical records and test results",
      status: "completed",
      date: "2024-01-16"
    },
    {
      id: 3,
      title: "Eligibility Assessment",
      description: "Clinical team review and biomarker testing",
      status: "in-progress",
      date: "2024-01-18"
    },
    {
      id: 4,
      title: "Informed Consent",
      description: "Review trial details and sign consent forms",
      status: "pending",
      date: "2024-01-22"
    },
    {
      id: 5,
      title: "Trial Enrollment",
      description: "Final approval and treatment scheduling",
      status: "pending",
      date: "2024-01-25"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "in-progress": return <Clock className="h-5 w-5 text-blue-600 animate-pulse" />;
      case "pending": return <Clock className="h-5 w-5 text-gray-400" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Role Banner */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 rounded-full p-3">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Patient Portal</h1>
                    <p className="text-green-100">Your Clinical Trial Journey</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  Transparent Trial Journey
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                My Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Name:</span>
                  <span className="font-medium">{mockPatientData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Age:</span>
                  <span className="font-medium">{mockPatientData.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Diagnosis:</span>
                  <span className="font-medium">{mockPatientData.diagnosis}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Stage:</span>
                  <Badge variant="secondary">{mockPatientData.stage}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Trial Match
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-slate-900 mb-2">
                    {mockPatientData.trialMatch}
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl font-bold text-green-600">
                      {mockPatientData.matchScore}%
                    </div>
                    <span className="text-sm text-slate-600">Compatibility</span>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-slate-600">Status:</p>
                  <Badge className="bg-blue-100 text-blue-800">
                    {mockPatientData.enrollmentStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600">Next Appointment:</p>
                  <p className="font-medium text-slate-900">{mockPatientData.nextAppointment}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Progress:</p>
                  <div className="mt-2">
                    <Progress value={(mockPatientData.completedSteps / mockPatientData.totalSteps) * 100} />
                    <p className="text-xs text-slate-500 mt-1">
                      {mockPatientData.completedSteps} of {mockPatientData.totalSteps} steps completed
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trial Journey */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Your Trial Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {trialSteps.map((step, index) => (
                <div key={step.id} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(step.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-slate-900">{step.title}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(step.status)}>
                          {step.status.replace('-', ' ')}
                        </Badge>
                        <span className="text-sm text-slate-500">{step.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{step.description}</p>
                    {step.status === "in-progress" && (
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          const nextStep = trialSteps.find(s => s.id === step.id + 1);
                          if (nextStep) {
                            alert(`Proceeding to: ${nextStep.title}`);
                          } else {
                            alert("Congratulations! You've completed all trial steps.");
                          }
                        }}
                      >
                        Continue Step
                      </Button>
                    )}
                    {step.status === "pending" && (
                      <Button size="sm" variant="outline" disabled>
                        Waiting for Previous Step
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Support Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Trial Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <span className="text-sm">Boston Medical Center</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-sm">Phase II Clinical Trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-slate-500" />
                  <span className="text-sm">FDA Approved Protocol</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Support & Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Download Trial Information
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Consultation
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Contact Study Coordinator
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}