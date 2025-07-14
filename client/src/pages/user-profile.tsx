import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/ui/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Shield, Settings, LogOut } from "lucide-react";

export default function UserProfile() {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">User not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Profile</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid gap-6">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={user.username}
                      readOnly
                      className="bg-gray-50 dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <Label htmlFor="userId">User ID</Label>
                    <Input
                      id="userId"
                      value={user.id}
                      readOnly
                      className="bg-gray-50 dark:bg-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <Label>Account Type</Label>
                  <div className="mt-2">
                    <Badge variant="secondary">
                      <Shield className="h-4 w-4 mr-1" />
                      Administrator
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label>System Access</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Dashboard Access
                      </span>
                      <Badge variant="outline" className="text-green-600">
                        Enabled
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Patient Management
                      </span>
                      <Badge variant="outline" className="text-green-600">
                        Enabled
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Trial Management
                      </span>
                      <Badge variant="outline" className="text-green-600">
                        Enabled
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Clinical Operations
                      </span>
                      <Badge variant="outline" className="text-green-600">
                        Enabled
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive email notifications for important updates
                    </p>
                  </div>
                  <Badge variant="outline" className="text-blue-600">
                    Enabled
                  </Badge>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Data Export</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Export patient and trial data
                    </p>
                  </div>
                  <Badge variant="outline" className="text-blue-600">
                    Available
                  </Badge>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">API Access</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Programmatic access to platform features
                    </p>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    Active
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LogOut className="h-5 w-5" />
                  Account Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Sign Out</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Sign out of your account on this device
                      </p>
                    </div>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      disabled={logoutMutation.isPending}
                    >
                      {logoutMutation.isPending ? "Signing out..." : "Sign Out"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}