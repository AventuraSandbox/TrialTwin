import { Bell, ChevronDown } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "./button";
import { Avatar, AvatarFallback } from "./avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useAuth } from "@/hooks/use-auth";

export function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const navigationItems = [
    { path: "/", label: "Home", active: location === "/" },
    { path: "/clinical-operations", label: "Clinical Operations", active: location === "/clinical-operations" },
    { path: "/patient-recruiter", label: "Patient Recruiter", active: location === "/patient-recruiter" },
    { path: "/patient-list", label: "Patient List", active: location === "/patient-list" },
    { path: "/patient-portal", label: "Patient Portal", active: location === "/patient-portal" },
    { path: "/site-coordinator", label: "Site Coordinator", active: location === "/site-coordinator" },
    { path: "/trial-management", label: "Trial Management", active: location === "/trial-management" },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                <div className="text-2xl medical-blue">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3C7.58 3 4 6.58 4 11c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4.42-3.58-8-8-8zM12 17c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
                    <path d="M12 7c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-0.9-2-2s0.9-2 2-2 2 0.9 2 2-0.9 2-2 2z"/>
                  </svg>
                </div>
                <h1 className="text-xl font-semibold text-slate-900">
<<<<<<< HEAD
                  TrialTwin
=======
                  Digital Twin Clinical Trials
>>>>>>> dfd3cb2e6931197ddaab1ccd87c9ab3a8aa81190
                </h1>
              </div>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            {navigationItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <span className={`text-sm font-medium transition-colors cursor-pointer ${
                  item.active 
                    ? "text-blue-600 border-b-2 border-blue-600 pb-1" 
                    : "text-slate-600 hover:text-slate-900"
                }`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5 text-slate-400" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    3
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>New trial matches available</DropdownMenuItem>
                <DropdownMenuItem>Patient enrollment update</DropdownMenuItem>
                <DropdownMenuItem>System maintenance scheduled</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-blue-600 text-white">
                      {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-slate-700 font-medium">
                    {user?.username || 'User'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href="/user-profile">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                </Link>
                <Link href="/user-profile">
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
