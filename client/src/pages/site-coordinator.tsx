import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/ui/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { User, Calendar, Users, TrendingUp, MapPin, Clock, AlertCircle } from "lucide-react";

export default function SiteCoordinator() {
  const { data: metricsData } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
  });

  const { data: trials } = useQuery({
    queryKey: ["/api/clinical-trials"],
  });

  const siteData = {
    siteName: "Boston Medical Center",
    coordinator: "Dr. James Wilson",
    activeTrials: trials?.length || 0,
    totalPatients: metricsData?.metrics?.activePatients || 0,
    thisWeekEnrollment: Math.floor((metricsData?.metrics?.activePatients || 0) * 0.2),
    resourceUtilization: Math.min(95, Math.floor((metricsData?.metrics?.activePatients || 0) * 3.2))
  };

  const activeTrials = trials?.map((trial: any) => ({
    id: trial.id,
    name: trial.name,
    phase: trial.phase,
    enrolled: trial.currentEnrollment,
    target: trial.maxEnrollment,
    status: trial.currentEnrollment >= trial.maxEnrollment ? "Complete" : 
           trial.currentEnrollment >= trial.maxEnrollment * 0.8 ? "Ahead" : 
           trial.currentEnrollment >= trial.maxEnrollment * 0.5 ? "On Track" : "Behind",
    nextVisit: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    urgency: trial.currentEnrollment < trial.maxEnrollment * 0.3 ? "high" : 
            trial.currentEnrollment < trial.maxEnrollment * 0.7 ? "medium" : "low"
  })) || [];

  const upcomingActivities = [
    {
      id: 1,
      type: "Screening Visit",
      patient: "Sarah Johnson",
      time: "09:00 AM",
      date: "2024-01-18",
      trial: "HER2+ Immunotherapy",
      status: "confirmed"
    },
    {
      id: 2,
      type: "Follow-up",
      patient: "Michael Chen",
      time: "11:30 AM",
      date: "2024-01-18",
      trial: "Advanced Combination",
      status: "confirmed"
    },
    {
      id: 3,
      type: "Enrollment",
      patient: "Jennifer Davis",
      time: "02:00 PM",
      date: "2024-01-19",
      trial: "Precision Biomarker",
      status: "pending"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Track": return "bg-green-100 text-green-800";
      case "Ahead": return "bg-blue-100 text-blue-800";
      case "Behind": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Role Banner */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 rounded-full p-3">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Site Coordinator Dashboard</h1>
                    <p className="text-orange-100">Site-Based Clinical Trial Management</p>
                    <p className="text-orange-100 text-sm">
                      <MapPin className="h-3 w-3 inline mr-1" />
                      {siteData.siteName}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  Resource Allocation & Flow
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Site Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Active Trials</p>
                  <p className="text-2xl font-semibold text-slate-900">{siteData.activeTrials}</p>
                </div>
                <div className="bg-blue-100 rounded-full p-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Patients</p>
                  <p className="text-2xl font-semibold text-slate-900">{siteData.totalPatients}</p>
                </div>
                <div className="bg-green-100 rounded-full p-2">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">This Week</p>
                  <p className="text-2xl font-semibold text-slate-900">{siteData.thisWeekEnrollment}</p>
                </div>
                <div className="bg-purple-100 rounded-full p-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Resource Usage</p>
                  <p className="text-2xl font-semibold text-slate-900">{siteData.resourceUtilization}%</p>
                </div>
                <div className="bg-yellow-100 rounded-full p-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Trials */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Active Trials at Site</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeTrials.map((trial) => (
                  <div key={trial.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">{trial.name}</h3>
                        <p className="text-sm text-slate-600">{trial.phase}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge className={getStatusColor(trial.status)}>
                          {trial.status}
                        </Badge>
                        <span className={`text-xs mt-1 ${getUrgencyColor(trial.urgency)}`}>
                          {trial.urgency} priority
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Enrollment Progress</span>
                        <span>{trial.enrolled}/{trial.target} patients</span>
                      </div>
                      <Progress value={(trial.enrolled / trial.target) * 100} className="h-2" />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Next visit: {trial.nextVisit}</span>
                        <span>{Math.round((trial.enrolled / trial.target) * 100)}% complete</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingActivities.map((activity) => (
                  <div key={activity.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900">{activity.type}</h3>
                        <p className="text-sm text-slate-600">{activity.patient}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.status}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-slate-600 space-y-1">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.date} at {activity.time}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {activity.trial}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resource Management */}
        <Card>
          <CardHeader>
            <CardTitle>Resource Allocation & Planning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-medium text-slate-900 mb-3">Staff Allocation</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Research Nurses</span>
                    <span>3/4 available</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>Clinical Coordinators</span>
                    <span>2/2 available</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-medium text-slate-900 mb-3">Equipment Usage</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Infusion Chairs</span>
                    <span>6/8 booked</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>Exam Rooms</span>
                    <span>4/6 booked</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-medium text-slate-900 mb-3">Weekly Capacity</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Screening Slots</span>
                    <span>12/15 used</span>
                  </div>
                  <Progress value={80} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>Follow-up Slots</span>
                    <span>8/10 used</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
              </div>
            </div>

            <div className="mt-6 flex space-x-2">
              <Button 
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => alert("Resource scheduling interface would open here")}
              >
                Schedule Resources
              </Button>
              <Button 
                variant="outline"
                onClick={() => alert("Full calendar view would open here")}
              >
                View Full Calendar
              </Button>
              <Button 
                variant="outline"
                onClick={() => alert("Report generation interface would open here")}
              >
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}