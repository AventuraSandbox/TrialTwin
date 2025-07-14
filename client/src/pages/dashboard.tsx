import { Link } from "wouter";
import { Header } from "@/components/ui/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Shield, Users, BarChart3, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const roleCards = [
    {
      role: "Clinical Operations",
      description: "Trial simulation, enrollment forecasting, and compliance oversight",
      color: "from-blue-600 to-blue-700",
      icon: Users,
      path: "/clinical-operations"
    },
    {
      role: "Patient Recruiter",
      description: "AI-ranked patient lists, engagement tracking, and outreach optimization",
      color: "from-purple-600 to-purple-700",
      icon: Brain,
      path: "/patient-recruiter"
    },
    {
      role: "Patient Portal",
      description: "Transparent eligibility, personalized journey, and trial preparation",
      color: "from-green-600 to-green-700",
      icon: Shield,
      path: "/patient-portal"
    },
    {
      role: "Site Coordinator",
      description: "Patient flow projections, resource allocation, and site analytics",
      color: "from-orange-600 to-orange-700",
      icon: BarChart3,
      path: "/site-coordinator"
    }
  ];

  const stats = [
    { label: "Active Patients", value: "147", color: "text-blue-600" },
    { label: "Trial Matches", value: "342", color: "text-green-600" },
    { label: "Enrollment Rate", value: "73%", color: "text-purple-600" },
    { label: "Platform Uptime", value: "99.9%", color: "text-orange-600" }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Digital Twins",
      description: "Create comprehensive patient profiles with clinical and lifestyle factors"
    },
    {
      icon: TrendingUp,
      title: "Intelligent Matching",
      description: "Advanced AI algorithms match patients to optimal clinical trials"
    },
    {
      icon: Users,
      title: "Patient Management",
      description: "Streamlined patient intake, tracking, and engagement workflows"
    },
    {
      icon: Shield,
      title: "Explainable AI",
      description: "Transparent scoring and reasoning for all matching decisions"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Transform Clinical Trial
                <br />
                <span className="text-blue-200">Recruitment & Execution</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto">
                Leverage AI-driven patient digital twins to reduce recruitment cycles by 30%, 
                increase qualified enrollment by 20%, and decrease drop-out rates by 15%.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                  <CheckCircle className="h-4 w-4 mr-2" />
<<<<<<< HEAD
                  CFR Part 11 Compliant
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Veeva & Medidata Integrated
=======
                  AI-Powered Matching
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Real-time Analytics
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Explainable AI
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Comprehensive Digital Trial Platform
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-none shadow-lg">
                  <CardContent className="p-6">
                    <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mb-4">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Role-Based Workflows */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Experience Role-Based Workflows
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Explore tailored interfaces designed for each stakeholder in the clinical trial ecosystem
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {roleCards.map((card, index) => (
                <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className={`bg-gradient-to-r ${card.color} text-white p-6 rounded-t-lg`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-white/20 rounded-full p-2">
                            <card.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-white">{card.role}</CardTitle>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-slate-600 mb-4">{card.description}</p>
                    <Link href={card.path}>
                      <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                        View Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Digital Twin Clinical Trials</h3>
              <p className="text-slate-300 text-sm">
                AI-powered patient-trial matching platform designed to accelerate clinical research and improve patient outcomes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform Features</h3>
              <ul className="text-slate-300 text-sm space-y-2">
                <li>• AI Digital Twin Generation</li>
                <li>• Intelligent Trial Matching</li>
                <li>• Explainable AI Decisions</li>
                <li>• Real-time Analytics</li>
              </ul>
            </div>
            <div>
<<<<<<< HEAD
              <h3 className="font-semibold mb-4">Compliance & Security</h3>
              <ul className="text-slate-300 text-sm space-y-2">
                <li>• HIPAA Compliant</li>
                <li>• CFR Part 11 Validated</li>
                <li>• SOC 2 Type II Certified</li>
                <li>• FDA 21 CFR Part 11 Ready</li>
=======
              <h3 className="font-semibold mb-4">Security & Performance</h3>
              <ul className="text-slate-300 text-sm space-y-2">
                <li>• Advanced Encryption</li>
                <li>• Real-time Processing</li>
                <li>• High Availability</li>
                <li>• Scalable Architecture</li>
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="text-slate-300 text-sm space-y-2">
                <li>24/7 Technical Support</li>
                <li>Clinical Research Support</li>
<<<<<<< HEAD
                <li>Regulatory Compliance Help</li>
=======
                <li>AI Model Support</li>
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190
                <li>Training & Documentation</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>© 2024 Digital Twin Clinical Trials Platform. All rights reserved. | Version 2.1.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
