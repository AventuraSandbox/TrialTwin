import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/ui/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, Phone, Mail, MapPin, Calendar, Star, Search, Filter } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

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
  aiScore?: number;
  eligibleTrials?: number;
  engagementScore?: number;
}

export default function PatientList() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStage, setSelectedStage] = useState("all");
  
  const { data: patients, isLoading } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const handleViewProfile = (patientId: number) => {
    setLocation(`/patient-profile/${patientId}`);
  };

  const filteredPatients = patients?.filter(patient => {
    const matchesSearch = searchTerm === "" || 
      patient.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.primaryDiagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStage = selectedStage === "all" || patient.cancerStage === selectedStage;
    
    return matchesSearch && matchesStage;
  }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-8">Loading patients...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Patient Directory</h1>
          <p className="mt-2 text-gray-600">
            Comprehensive patient management with AI-powered matching and analytics
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search patients by name, diagnosis, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Stages</option>
              <option value="Stage I">Stage I</option>
              <option value="Stage II">Stage II</option>
              <option value="Stage III">Stage III</option>
              <option value="Stage IV">Stage IV</option>
            </select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Directory ({filteredPatients.length} patients)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>AI Score</TableHead>
                  <TableHead>Eligible Trials</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        {patient.firstName} {patient.lastName}
                      </div>
                    </TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.primaryDiagnosis}</TableCell>
                    <TableCell>
                      <Badge variant={patient.cancerStage?.includes('I') ? 'default' : 'secondary'}>
                        {patient.cancerStage}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        {patient.aiScore || 85}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{patient.eligibleTrials || 3} trials</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        {patient.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewProfile(patient.id)}
                      >
                        View Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredPatients.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No patients found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}