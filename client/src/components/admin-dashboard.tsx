import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useCampaignData, useRecentDonations } from "@/hooks/use-campaign-data";

const offlineDonationSchema = z.object({
  donorName: z.string().optional(),
  amount: z.string().min(1, "Amount is required").transform(Number),
  frequency: z.enum(["monthly", "annual", "one-time"]),
  dateReceived: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

type OfflineDonationForm = z.infer<typeof offlineDonationSchema>;

interface AdminDashboardProps {
  onClose: () => void;
}

export default function AdminDashboard({ onClose }: AdminDashboardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: campaignSummary } = useCampaignData();
  const { data: recentDonations } = useRecentDonations();
  
  const form = useForm<OfflineDonationForm>({
    resolver: zodResolver(offlineDonationSchema),
    defaultValues: {
      frequency: "one-time",
      dateReceived: new Date().toISOString().split('T')[0],
    },
  });

  const addOfflineDonation = useMutation({
    mutationFn: async (data: OfflineDonationForm) => {
      return apiRequest("POST", "/api/donations", {
        ...data,
        source: "offline",
        donorEmail: "offline@donation.local", // Required field
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaign/summary"] });
      queryClient.invalidateQueries({ queryKey: ["/api/donations/recent"] });
      
      toast({
        title: "Success",
        description: "Offline donation added successfully!",
      });
      
      form.reset({
        frequency: "one-time",
        dateReceived: new Date().toISOString().split('T')[0],
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add offline donation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: OfflineDonationForm) => {
    addOfflineDonation.mutate(data);
  };

  const exportCampaignData = () => {
    // TODO: Implement actual export functionality
    toast({
      title: "Export Started",
      description: "Campaign data export will be available shortly.",
    });
  };

  return (
    <section className="py-20 bg-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-slate-900">
                Campaign Management Dashboard
              </CardTitle>
              <Button variant="ghost" onClick={onClose}>
                <i className="fas fa-times text-xl"></i>
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Manual Donation Entry */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-900">Add Offline Donation</h3>
                
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="admin-donorName">Donor Name (Optional)</Label>
                    <Input
                      {...form.register("donorName")}
                      id="admin-donorName"
                      placeholder="Anonymous"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="admin-amount">Amount (NZD)</Label>
                      <Input
                        {...form.register("amount")}
                        id="admin-amount"
                        type="number"
                        placeholder="100"
                        min="1"
                        step="0.01"
                      />
                      {form.formState.errors.amount && (
                        <p className="text-sm text-red-600 mt-1">{form.formState.errors.amount.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="admin-frequency">Frequency</Label>
                      <Select 
                        value={form.watch("frequency")} 
                        onValueChange={(value) => form.setValue("frequency", value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="one-time">One-time</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="annual">Annual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="admin-dateReceived">Date Received</Label>
                    <Input
                      {...form.register("dateReceived")}
                      id="admin-dateReceived"
                      type="date"
                    />
                    {form.formState.errors.dateReceived && (
                      <p className="text-sm text-red-600 mt-1">{form.formState.errors.dateReceived.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="admin-notes">Notes</Label>
                    <Textarea
                      {...form.register("notes")}
                      id="admin-notes"
                      className="h-20 resize-none"
                      placeholder="Additional details..."
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-church-blue text-white hover:bg-blue-700"
                    disabled={addOfflineDonation.isPending}
                  >
                    <i className="fas fa-plus mr-2"></i>
                    {addOfflineDonation.isPending ? "Adding..." : "Add Donation"}
                  </Button>
                </form>
              </div>
              
              {/* Campaign Statistics */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-900">Campaign Statistics</h3>
                
                {campaignSummary && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-church-blue to-blue-600 rounded-xl p-4 text-white">
                      <div className="text-2xl font-bold">${campaignSummary.totalRaised.toLocaleString()}</div>
                      <div className="text-blue-100">Total Raised</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-church-green to-green-600 rounded-xl p-4 text-white">
                      <div className="text-2xl font-bold">{campaignSummary.donorCount}</div>
                      <div className="text-green-100">Total Donors</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-church-amber to-yellow-600 rounded-xl p-4 text-white">
                      <div className="text-2xl font-bold">${campaignSummary.monthlyCommitments.toLocaleString()}</div>
                      <div className="text-yellow-100">Monthly Recurring</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                      <div className="text-2xl font-bold">{campaignSummary.progressPercentage}%</div>
                      <div className="text-purple-100">Goal Progress</div>
                    </div>
                  </div>
                )}
                
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Recent Donations</h4>
                  <div className="space-y-2 text-sm">
                    {recentDonations && Array.isArray(recentDonations) ? recentDonations.slice(0, 5).map((donation: any, index: number) => (
                      <div key={index} className="flex justify-between">
                        <span>{donation.donorName || "Anonymous"} - {donation.frequency}</span>
                        <span className="font-medium">${parseFloat(donation.amount).toLocaleString()}</span>
                      </div>
                    )) : (
                      <p className="text-slate-500">No donations yet</p>
                    )}
                  </div>
                </div>
                
                <Button 
                  onClick={exportCampaignData}
                  className="w-full bg-church-green text-white hover:bg-green-700"
                >
                  <i className="fas fa-download mr-2"></i>Export Campaign Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
