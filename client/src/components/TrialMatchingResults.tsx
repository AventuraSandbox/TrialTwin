<<<<<<< HEAD
import { useQuery, useMutation } from "@tanstack/react-query";
=======
import { useQuery } from "@tanstack/react-query";
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
<<<<<<< HEAD
import { RefreshCw, MapPin, Calendar, Users, Brain, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
=======
import { RefreshCw, MapPin, Calendar, Users, Brain } from "lucide-react";
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190

interface TrialMatchingResultsProps {
  patientId: number;
}

export function TrialMatchingResults({ patientId }: TrialMatchingResultsProps) {
<<<<<<< HEAD
  const { toast } = useToast();
  
=======
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190
  const { data: matchesData, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/trial-matches/patient", patientId],
    enabled: !!patientId,
  });

  const { data: trialsData } = useQuery({
    queryKey: ["/api/clinical-trials"],
  });

<<<<<<< HEAD
  const enrollmentMutation = useMutation({
    mutationFn: async ({ patientId, trialId }: { patientId: number, trialId: number }) => {
      const response = await apiRequest("POST", `/api/patients/${patientId}/enroll/${trialId}`);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Enrollment Successful",
        description: data.message,
      });
      // Refresh dashboard metrics
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Enrollment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

=======
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trial Matches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                  <Skeleton className="h-12 w-16" />
                </div>
                <Skeleton className="h-20 w-full mb-3" />
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-32" />
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
            <p>Error loading trial matches</p>
            <Button onClick={() => refetch()} variant="outline" className="mt-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

<<<<<<< HEAD
  if (!matchesData || !Array.isArray(matchesData) || matchesData.length === 0) {
=======
  if (!matchesData?.success || !matchesData.matches.length) {
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-slate-500">
            <p>No trial matches found</p>
            <p className="text-sm mt-2">Try adjusting patient criteria or check back later</p>
          </div>
        </CardContent>
      </Card>
    );
  }

<<<<<<< HEAD
  const matches = matchesData;
=======
  const matches = matchesData.matches;
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190
  const trials = trialsData?.trials || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Trial Matches</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800">
              {matches.length} Matches Found
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              className="text-slate-400 hover:text-slate-600"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {matches.map((match, index) => {
            const trial = trials.find(t => t.id === match.trialId);
            if (!trial) return null;

            return (
              <div
                key={match.id}
                className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">{trial.name}</h3>
                    <p className="text-sm text-slate-600 mb-2">Sponsored by {trial.sponsor}</p>
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <span>
                        <MapPin className="h-3 w-3 inline mr-1" />
                        {trial.location}
                      </span>
                      <span>
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {trial.phase}
                      </span>
                      <span>
                        <Users className="h-3 w-3 inline mr-1" />
                        {trial.currentEnrollment}/{trial.maxEnrollment} enrolled
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold px-3 py-1 rounded-lg mb-2 text-white ${getScoreColor(match.matchScore)}`}>
                      {match.matchScore}%
                    </div>
                    <p className="text-xs text-slate-500">Match Score</p>
                  </div>
                </div>

                {/* AI Explanation */}
                <div className="bg-slate-50 rounded-lg p-3 mb-3">
                  <h4 className="font-medium text-slate-900 mb-2 flex items-center">
                    <Brain className="h-4 w-4 text-purple-600 mr-2" />
                    AI Explanation
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${getFactorColor(match.biomarkerScore)}`} />
                      <span className="text-slate-700">
                        Biomarker match: {getFactorLabel(match.biomarkerScore)} ({match.biomarkerScore}%)
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${getFactorColor(match.locationScore)}`} />
                      <span className="text-slate-700">
                        Location preference: {getFactorLabel(match.locationScore)} ({match.locationScore}%)
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${getFactorColor(match.burdenScore)}`} />
                      <span className="text-slate-700">
                        Treatment burden: {getFactorLabel(match.burdenScore)} ({match.burdenScore}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Burden Assessment */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${getBurdenColor(trial.treatmentBurden)}`}>
                        {trial.treatmentBurden}
                      </div>
                      <div className="text-xs text-slate-500">Treatment Burden</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${getBurdenColor(trial.travelBurden)}`}>
                        {trial.travelBurden}
                      </div>
                      <div className="text-xs text-slate-500">Travel Burden</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${getCompletionColor(match.completionLikelihood)}`}>
                        {match.completionLikelihood}
                      </div>
                      <div className="text-xs text-slate-500">Completion Likelihood</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                      View Details
                    </Button>
<<<<<<< HEAD
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => enrollmentMutation.mutate({ patientId, trialId: trial.id })}
                      disabled={enrollmentMutation.isPending}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      {enrollmentMutation.isPending ? "Enrolling..." : "Enroll Patient"}
=======
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Express Interest
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function getScoreColor(score: number): string {
  if (score >= 85) return "bg-green-600";
  if (score >= 70) return "bg-yellow-600";
  if (score >= 50) return "bg-orange-600";
  return "bg-slate-400";
}

function getFactorColor(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  return "bg-red-400";
}

function getFactorLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Good";
  if (score >= 60) return "Moderate";
  return "Limited";
}

function getBurdenColor(burden: string): string {
  switch (burden.toLowerCase()) {
    case "low":
      return "text-green-600";
    case "medium":
      return "text-yellow-600";
    case "high":
      return "text-red-600";
    default:
      return "text-slate-500";
  }
}

function getCompletionColor(likelihood: string): string {
  switch (likelihood.toLowerCase()) {
    case "high":
      return "text-green-600";
    case "medium":
      return "text-yellow-600";
    case "low":
      return "text-red-600";
    default:
      return "text-slate-500";
  }
}
