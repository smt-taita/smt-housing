import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current campaign data
  const { data: campaignData } = useQuery({
    queryKey: ['/api/campaign/summary'],
    enabled: isAuthenticated
  });

  // Authentication mutation
  const authMutation = useMutation({
    mutationFn: async (password: string) => {
      const response = await apiRequest('POST', '/api/admin/auth', { password });
      return response;
    },
    onSuccess: () => {
      setIsAuthenticated(true);
      toast({
        title: "Authentication successful",
        description: "You can now update the funds raised amount.",
      });
    },
    onError: () => {
      toast({
        title: "Authentication failed",
        description: "Invalid password. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update amount mutation
  const updateMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await apiRequest('POST', '/api/admin/update-amount', { amount });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/campaign/summary'] });
      toast({
        title: "Success!",
        description: "Funds raised amount has been updated.",
      });
      setNewAmount("");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to update the amount. Please try again.";
      
      // If unauthorized, reset authentication state
      if (error?.response?.status === 401) {
        setIsAuthenticated(false);
        setPassword("");
        setNewAmount("");
        toast({
          title: "Session expired",
          description: "Please login again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Update failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/admin/logout', {});
      return response;
    },
    onSuccess: () => {
      setIsAuthenticated(false);
      setPassword("");
      setNewAmount("");
      toast({
        title: "Logged out",
        description: "You have been securely logged out.",
      });
    },
    onError: () => {
      // Even if logout fails, clear local state for security
      setIsAuthenticated(false);
      setPassword("");
      setNewAmount("");
      toast({
        title: "Logged out",
        description: "Session cleared.",
      });
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      toast({
        title: "Password required",
        description: "Please enter the admin password.",
        variant: "destructive",
      });
      return;
    }
    authMutation.mutate(password);
  };

  const handleUpdateAmount = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newAmount);
    if (!amount || amount < 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive amount.",
        variant: "destructive",
      });
      return;
    }
    updateMutation.mutate(amount);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-slate-900">Admin Access</CardTitle>
            <CardDescription>
              Enter the admin password to update fundraising amounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  data-testid="input-admin-password"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-church-blue hover:bg-blue-700"
                disabled={authMutation.isPending}
                data-testid="button-admin-login"
              >
                {authMutation.isPending ? "Authenticating..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Update the fundraising campaign totals</p>
        </div>

        {/* Current Status */}
        {campaignData && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Current Campaign Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-church-green">${(campaignData as any)?.totalRaised?.toLocaleString() || 0}</p>
                  <p className="text-sm text-slate-600">Total Raised</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-church-blue">${(campaignData as any)?.goal?.toLocaleString() || 24000}</p>
                  <p className="text-sm text-slate-600">Annual Goal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Update Form */}
        <Card>
          <CardHeader>
            <CardTitle>Update Funds Raised</CardTitle>
            <CardDescription>
              Enter the new total amount raised (this will replace the current amount)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateAmount} className="space-y-4">
              <div>
                <Label htmlFor="amount">New Total Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="Enter new total amount"
                  data-testid="input-new-amount"
                />
              </div>
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-church-green hover:bg-green-700"
                  disabled={updateMutation.isPending}
                  data-testid="button-update-amount"
                >
                  {updateMutation.isPending ? "Updating..." : "Update Amount"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  data-testid="button-logout"
                >
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>• Enter the total amount raised so far (not just new donations)</p>
            <p>• The amount will be immediately visible on the main website</p>
            <p>• Use the logout button when finished to secure the admin panel</p>
            <p>• Bookmark this page for easy access: <code className="bg-slate-100 px-1 rounded">yoursite.com/admin</code></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}