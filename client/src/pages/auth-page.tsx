import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { Activity } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  const onSubmit = (data: LoginForm) => {
    if (isLogin) {
      loginMutation.mutate(data);
    } else {
      registerMutation.mutate(data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Auth Form */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-600 rounded-full p-3">
                <Activity className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              {isLogin ? "Sign In" : "Create Account"}
            </CardTitle>
            <p className="text-slate-600">
              {isLogin 
                ? "Access your clinical trial platform" 
                : "Join the digital twin platform"}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  {...register("username")}
                  placeholder="Enter your username"
                  className={errors.username ? "border-red-500" : ""}
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="Enter your password"
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loginMutation.isPending || registerMutation.isPending}
              >
                {(loginMutation.isPending || registerMutation.isPending) 
                  ? "Please wait..." 
                  : (isLogin ? "Sign In" : "Create Account")}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </p>
              <Button
                variant="ghost"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-700"
              >
                {isLogin ? "Create Account" : "Sign In"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Side - Hero Section */}
        <div className="hidden lg:flex flex-col justify-center space-y-6">
          <div className="text-center space-y-4">
            <Badge className="bg-purple-100 text-purple-800 text-sm px-3 py-1">
              AI-Powered Clinical Trials
            </Badge>
            <h1 className="text-4xl font-bold text-slate-900">
<<<<<<< HEAD
              TrialTwin Platform
=======
              Digital Twin Platform
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190
            </h1>
            <p className="text-lg text-slate-600 max-w-md mx-auto">
              Revolutionizing pharmaceutical clinical trials through AI-powered patient matching and digital twin technology.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-2">Smart Patient Matching</h3>
              <p className="text-sm text-slate-600">
                AI algorithms match patients to optimal clinical trials based on biomarkers, location, and treatment history.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-2">Digital Twin Profiles</h3>
              <p className="text-sm text-slate-600">
                Generate comprehensive patient profiles to predict trial outcomes and optimize recruitment.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-2">Explainable AI</h3>
              <p className="text-sm text-slate-600">
                Transparent AI decision-making with clear explanations for all matching recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}