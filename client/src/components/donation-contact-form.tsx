
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";

const donationContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  amount: z.string().min(1, "Amount is required").transform(Number),
  frequency: z.enum(["one-off", "monthly"]),
});

type DonationContactForm = z.infer<typeof donationContactSchema>;

interface DonationContactFormProps {
  onClose: () => void;
}

export default function DonationContactForm({ onClose }: DonationContactFormProps) {
  const { toast } = useToast();

  const form = useForm<DonationContactForm>({
    resolver: zodResolver(donationContactSchema),
    defaultValues: {
      frequency: "monthly",
    },
  });

  const submitDonationContact = useMutation({
    mutationFn: async (data: DonationContactForm) => {
      return apiRequest("POST", "/api/donation-contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Thank you for your interest!",
        description: "We'll contact you shortly about your donation.",
      });

      // Track donation contact event
      trackEvent('donation_contact_submitted', 'engagement', 'contact_form', form.getValues().amount);

      form.reset();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit your information. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: DonationContactForm) => {
    submitDonationContact.mutate(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-church-blue">
              Donation Information
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <i className="fas fa-times"></i>
            </Button>
          </div>
          <p className="text-sm text-slate-600">
            Tell us about your donation interest and we'll contact you with payment details.
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                {...form.register("name")}
                id="name"
                placeholder="Your full name"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                {...form.register("email")}
                id="email"
                type="email"
                placeholder="your.email@example.com"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="amount">Donation Amount (NZD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-500">$</span>
                <Input
                  {...form.register("amount")}
                  id="amount"
                  type="number"
                  className="pl-8"
                  placeholder="100"
                  min="1"
                  step="1"
                />
              </div>
              {form.formState.errors.amount && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.amount.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Select
                value={form.watch("frequency")}
                onValueChange={(value) => form.setValue("frequency", value as any)}
              >
                <SelectTrigger className="bg-white border-slate-300 text-slate-900 focus:border-church-blue focus:ring-church-blue">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-slate-200 shadow-lg">
                  <SelectItem value="monthly" className="text-slate-900 hover:bg-church-blue hover:text-white focus:bg-church-blue focus:text-white">Monthly</SelectItem>
                  <SelectItem value="one-off" className="text-slate-900 hover:bg-church-blue hover:text-white focus:bg-church-blue focus:text-white">One-off</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-church-amber text-white hover:bg-amber-600"
                disabled={submitDonationContact.isPending}
              >
                {submitDonationContact.isPending ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
