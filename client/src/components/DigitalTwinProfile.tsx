import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Bot } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

interface DigitalTwinProfileProps {
  patientId: number;
}

export function DigitalTwinProfile({ patientId }: DigitalTwinProfileProps) {
  const { data: digitalTwin, isLoading, error } = useQuery({
    queryKey: ["/api/digital-twins/patient", patientId],
    enabled: !!patientId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Digital Twin Profile</span>
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-slate-600">AI Generated</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-50 rounded-lg p-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-slate-500">
            <p>Error loading digital twin profile</p>
            <p className="text-sm mt-2">Please try again later</p>
          </div>
        </CardContent>
      </Card>
    );
  }

<<<<<<< HEAD
  if (!digitalTwin) {
=======
  if (!digitalTwin?.success) {
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-slate-500">
            <p>Digital twin profile not found</p>
            <p className="text-sm mt-2">Please create a patient profile first</p>
          </div>
        </CardContent>
      </Card>
    );
  }

<<<<<<< HEAD
  const twin = digitalTwin;
=======
  const twin = digitalTwin.digitalTwin;
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Digital Twin Profile</span>
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-purple-600" />
            <span className="text-sm text-slate-600">AI Generated</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-medium text-slate-900 mb-3">Clinical Profile</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Risk Score:</span>
                <Badge variant={getRiskVariant(twin.clinicalProfile.riskScore)}>
                  {twin.clinicalProfile.riskScore}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Biomarkers:</span>
                <span className="font-medium text-slate-900">{twin.clinicalProfile.biomarkers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Performance:</span>
                <span className="font-medium text-slate-900">{twin.clinicalProfile.performance}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-medium text-slate-900 mb-3">Lifestyle Factors</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Mobility:</span>
                <Badge variant={getLifestyleVariant(twin.lifestyleFactors.mobility)}>
                  {twin.lifestyleFactors.mobility}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Support System:</span>
                <Badge variant={getLifestyleVariant(twin.lifestyleFactors.support)}>
                  {twin.lifestyleFactors.support}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Compliance:</span>
                <span className="font-medium text-slate-900">{twin.lifestyleFactors.compliance}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-medium text-slate-900 mb-3">Engagement Signals</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Motivation:</span>
                <Badge variant={getEngagementVariant(twin.engagementSignals.motivation)}>
                  {twin.engagementSignals.motivation}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Availability:</span>
                <span className="font-medium text-slate-900">{twin.engagementSignals.availability}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Tech Comfort:</span>
                <span className="font-medium text-slate-900">{twin.engagementSignals.techComfort}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getRiskVariant(risk: string): "default" | "secondary" | "destructive" {
  switch (risk.toLowerCase()) {
    case "low":
      return "default";
    case "moderate":
      return "secondary";
    case "high":
      return "destructive";
    default:
      return "secondary";
  }
}

function getLifestyleVariant(factor: string): "default" | "secondary" {
  return factor.toLowerCase() === "high" || factor.toLowerCase() === "strong" ? "default" : "secondary";
}

function getEngagementVariant(engagement: string): "default" | "secondary" {
  return engagement.toLowerCase() === "high" ? "default" : "secondary";
}
