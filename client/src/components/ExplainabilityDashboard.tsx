import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { BarChart3, Brain } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

interface ExplainabilityDashboardProps {
  patientId: number;
}

export function ExplainabilityDashboard({ patientId }: ExplainabilityDashboardProps) {
  const { data: matchesData, isLoading } = useQuery({
    queryKey: ["/api/trial-matches/patient", patientId],
    enabled: !!patientId,
  });

  const { data: patientData } = useQuery({
    queryKey: ["/api/patients", patientId],
    enabled: !!patientId,
  });

  const { data: explainabilityData } = useQuery({
    queryKey: ["/api/explainability", patientId],
    queryFn: async () => {
<<<<<<< HEAD
      if (!matchesData || !patientData) return null;
=======
      if (!matchesData?.success || !patientData?.success) return null;
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190
      
      const response = await fetch("/api/explainability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
<<<<<<< HEAD
          matches: matchesData,
          patient: patientData,
=======
          matches: matchesData.matches,
          patient: patientData.patient,
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190
        }),
      });
      
      return response.json();
    },
<<<<<<< HEAD
    enabled: !!matchesData && !!patientData,
=======
    enabled: !!matchesData?.success && !!patientData?.success,
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>AI Explainability Dashboard</span>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-slate-600">SHAP Analysis</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-2 flex-1" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!explainabilityData?.success) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-slate-500">
            <p>Explainability analysis not available</p>
            <p className="text-sm mt-2">Complete patient intake to generate AI explanations</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const explainability = explainabilityData.explainability;
  const featureImportance = explainability.feature_importance;
  const confidenceMetrics = explainability.confidence_metrics;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>AI Explainability Dashboard</span>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            <span className="text-sm text-slate-600">SHAP Analysis</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature Importance */}
          <div>
            <h3 className="font-medium text-slate-900 mb-4">Top Matching Factors</h3>
            <div className="space-y-3">
              {Object.entries(featureImportance).map(([factor, importance]) => {
                const impactValue = Math.abs(importance as number);
                const isPositive = (importance as number) >= 0;
                
                return (
                  <div key={factor} className="flex items-center">
                    <div className="w-24 text-sm text-slate-600 capitalize">
                      {factor}
                    </div>
                    <div className="flex-1 mx-3">
                      <Progress 
                        value={impactValue * 100} 
                        className={`h-2 ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}
                      />
                    </div>
                    <div className={`w-12 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? '+' : ''}{importance.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Model Confidence */}
          <div>
            <h3 className="font-medium text-slate-900 mb-4">Model Confidence Metrics</h3>
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Overall Confidence</span>
                  <span className="text-lg font-semibold text-slate-900">
                    {Math.round(confidenceMetrics.overall_confidence * 100)}%
                  </span>
                </div>
                <Progress value={confidenceMetrics.overall_confidence * 100} className="h-2" />
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Data Quality Score</span>
                  <span className="text-lg font-semibold text-slate-900">
                    {Math.round(confidenceMetrics.data_quality * 100)}%
                  </span>
                </div>
                <Progress value={confidenceMetrics.data_quality * 100} className="h-2" />
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Prediction Stability</span>
                  <span className="text-lg font-semibold text-slate-900">
                    {Math.round(confidenceMetrics.prediction_stability * 100)}%
                  </span>
                </div>
                <Progress value={confidenceMetrics.prediction_stability * 100} className="h-2" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-slate-900 mb-2 flex items-center">
            <Brain className="h-4 w-4 mr-2" />
            Model Decision Summary
          </h4>
          <p className="text-sm text-slate-700">
            {explainability.model_summary}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
