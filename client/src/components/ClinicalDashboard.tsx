import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowUp, Users, Search, TrendingUp, Target } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

export function ClinicalDashboard() {
  const { data: metricsData, isLoading } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Clinical Operations Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full mt-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metricsData?.success) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-slate-500">
            <p>Dashboard metrics not available</p>
            <p className="text-sm mt-2">Please check back later</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const metrics = metricsData.metrics;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Clinical Operations Dashboard</h2>
        <Badge variant="outline" className="text-green-600 border-green-600">
          System Operational
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Patients</p>
                <p className="text-2xl font-semibold text-slate-900">{metrics.activePatients.toLocaleString()}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-2">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Trial Matches</p>
                <p className="text-2xl font-semibold text-slate-900">{metrics.trialMatches.toLocaleString()}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-2">
                <Search className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+8% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Enrollment Rate</p>
                <p className="text-2xl font-semibold text-slate-900">{metrics.enrollmentRate}%</p>
              </div>
              <div className="bg-green-100 rounded-full p-2">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+15% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg. Match Score</p>
                <p className="text-2xl font-semibold text-slate-900">{metrics.avgMatchScore}%</p>
              </div>
              <div className="bg-yellow-100 rounded-full p-2">
                <Target className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+3% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Patient Satisfaction</span>
                <Badge className="bg-green-100 text-green-800">Excellent</Badge>
              </div>
              <div className="text-2xl font-semibold text-slate-900">4.8/5.0</div>
              <p className="text-xs text-slate-500 mt-1">Based on 247 surveys</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Recruitment Speed</span>
                <Badge className="bg-blue-100 text-blue-800">Improved</Badge>
              </div>
              <div className="text-2xl font-semibold text-slate-900">-30%</div>
              <p className="text-xs text-slate-500 mt-1">Faster than baseline</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Model Accuracy</span>
                <Badge className="bg-purple-100 text-purple-800">High</Badge>
              </div>
              <div className="text-2xl font-semibold text-slate-900">87%</div>
              <p className="text-xs text-slate-500 mt-1">Prediction accuracy</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
