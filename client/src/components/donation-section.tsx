import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";

const donationSchema = z.object({
  amount: z.string().min(1, "Amount is required").transform(Number),
  frequency: z.enum(["monthly", "annual", "one-time"]),
  donorName: z.string().optional(),
  donorEmail: z.string().email("Valid email required"),
  donorPhone: z.string().optional(),
  message: z.string().optional(),
  anonymous: z.boolean().default(false),
  receiveUpdates: z.boolean().default(true),
});

type DonationForm = z.infer<typeof donationSchema>;

const donationOptions = [
  { amount: 20, label: "Community Supporter", annual: 240 },
  { amount: 50, label: "Housing Champion", annual: 600 },
  { amount: 100, label: "Community Partner", annual: 1200, preferred: true },
  { amount: 200, label: "Housing Hero", annual: 2400 },
];

export default function DonationSection() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(100);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<DonationForm>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 100,
      frequency: "monthly",
      anonymous: false,
      receiveUpdates: true,
    },
  });

  const createDonation = useMutation({
    mutationFn: async (data: DonationForm) => {
      return apiRequest("POST", "/api/donations", {
        ...data,
        source: "online",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaign/summary"] });
      queryClient.invalidateQueries({ queryKey: ["/api/donations/recent"] });
      
      toast({
        title: "Thank you for your donation!",
        description: "You will be redirected to secure payment processing.",
      });
      
      // Track donation event
      trackEvent('donation_initiated', 'engagement', 'online_form', form.getValues().amount);
      
      // TODO: Redirect to Stripe/PayPal
      console.log("Redirect to payment processor with:", form.getValues());
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to process donation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: DonationForm) => {
    createDonation.mutate(data);
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Help St Matt's Taitā keep affordable homes available for families in need");
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
    trackEvent('share', 'social', 'facebook');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent("St Matt's Kāinga - Community Housing Project");
    const body = encodeURIComponent("I wanted to share this important fundraising campaign with you. St Matt's Taitā is working to keep 8 homes affordable for families in need. Learn more: " + window.location.href);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    trackEvent('share', 'social', 'email');
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent("Help St Matt's Taitā keep affordable homes available for families in need: " + window.location.href);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    trackEvent('share', 'social', 'whatsapp');
  };

  return (
    <section id="help" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Join Our Village of Support</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            We need 20 donors giving $100 monthly to reach our goal. Every contribution, 
            large or small, makes a real difference in keeping families housed.
          </p>
        </div>
        
        {/* Donation Options */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-center text-slate-900 mb-8">Monthly Giving Options</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {donationOptions.map((option) => (
              <Card
                key={option.amount}
                className={`cursor-pointer transition-all hover:shadow-xl relative ${
                  selectedAmount === option.amount 
                    ? 'ring-2 ring-church-amber' 
                    : option.preferred 
                    ? 'bg-gradient-to-br from-church-amber to-yellow-400 text-white' 
                    : 'bg-white'
                }`}
                onClick={() => {
                  setSelectedAmount(option.amount);
                  form.setValue('amount', option.amount);
                }}
              >
                {option.preferred && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-church-blue text-white px-4 py-1 rounded-full text-sm font-medium">Preferred</span>
                  </div>
                )}
                <CardContent className="p-6 text-center">
                  <div className={`text-2xl font-bold mb-2 ${option.preferred ? 'text-white' : 'text-church-blue'}`}>
                    ${option.amount}
                  </div>
                  <div className={`mb-3 ${option.preferred ? 'text-amber-100' : 'text-slate-600'}`}>
                    per month
                  </div>
                  <div className={`text-sm ${option.preferred ? 'text-amber-100' : 'text-slate-500'}`}>
                    ${option.annual}/year
                  </div>
                  <div className={`text-sm mt-2 font-medium ${option.preferred ? 'text-white' : 'text-church-green'}`}>
                    {option.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Donation Form */}
          <Card>
            <CardContent className="p-8">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
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
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="annual">Annual</SelectItem>
                        <SelectItem value="one-time">One-time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="donorName">Full Name</Label>
                    <Input
                      {...form.register("donorName")}
                      id="donorName"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="donorEmail">Email</Label>
                    <Input
                      {...form.register("donorEmail")}
                      id="donorEmail"
                      type="email"
                      placeholder="your.email@example.com"
                    />
                    {form.formState.errors.donorEmail && (
                      <p className="text-sm text-red-600 mt-1">{form.formState.errors.donorEmail.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="donorPhone">Phone (Optional)</Label>
                  <Input
                    {...form.register("donorPhone")}
                    id="donorPhone"
                    type="tel"
                    placeholder="021 123 4567"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    {...form.register("message")}
                    id="message"
                    className="h-24 resize-none"
                    placeholder="Share why you want to support St Matt's Kāinga..."
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="anonymous"
                    checked={form.watch("anonymous")}
                    onCheckedChange={(checked) => form.setValue("anonymous", !!checked)}
                  />
                  <Label htmlFor="anonymous" className="text-sm">
                    Make my donation anonymous
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="receiveUpdates"
                    checked={form.watch("receiveUpdates")}
                    onCheckedChange={(checked) => form.setValue("receiveUpdates", !!checked)}
                  />
                  <Label htmlFor="receiveUpdates" className="text-sm">
                    Send me quarterly updates about the project
                  </Label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-church-amber text-white hover:bg-amber-600 py-4 text-lg font-semibold shadow-lg"
                  disabled={createDonation.isPending}
                >
                  <i className="fas fa-heart mr-2"></i>
                  {createDonation.isPending ? "Processing..." : "Proceed to Payment"}
                </Button>
                
                <p className="text-sm text-slate-600 text-center">
                  <i className="fas fa-shield-alt mr-2 text-church-green"></i>
                  Secure payment processing via Stripe. Tax-deductible receipts provided.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
        
        {/* Other Ways to Help */}
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Other Ways to Support</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-xl">
                <div className="bg-church-blue bg-opacity-20 rounded-lg p-3">
                  <i className="fas fa-praying-hands text-church-blue"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Prayer Support</h4>
                  <p className="text-slate-600">Join our prayer network for residents and the project's future.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-xl">
                <div className="bg-church-green bg-opacity-20 rounded-lg p-3">
                  <i className="fas fa-tools text-church-green"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Volunteer Skills</h4>
                  <p className="text-slate-600">Offer maintenance, gardening, or community-building support.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-xl">
                <div className="bg-church-amber bg-opacity-20 rounded-lg p-3">
                  <i className="fas fa-share-alt text-church-amber"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Share with Networks</h4>
                  <p className="text-slate-600">Help us reach more potential supporters in your community.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-xl">
                <div className="bg-purple-100 rounded-lg p-3">
                  <i className="fas fa-handshake text-purple-600"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Workplace Partnerships</h4>
                  <p className="text-slate-600">Connect your church or workplace for group giving opportunities.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Social Sharing */}
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Share Our Story</h3>
            
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 mb-6">
              <p className="text-slate-700 mb-4">Help us reach more supporters by sharing on social media:</p>
              
              <div className="flex space-x-4">
                <Button onClick={shareOnFacebook} className="bg-blue-600 hover:bg-blue-700">
                  <i className="fab fa-facebook-f mr-2"></i>Facebook
                </Button>
                
                <Button onClick={shareViaEmail} className="bg-gray-600 hover:bg-gray-700">
                  <i className="fas fa-envelope mr-2"></i>Email
                </Button>
                
                <Button onClick={shareOnWhatsApp} className="bg-green-600 hover:bg-green-700">
                  <i className="fab fa-whatsapp mr-2"></i>WhatsApp
                </Button>
              </div>
            </div>
            
            {/* Sample testimonial */}
            <div className="bg-white border-l-4 border-church-green p-6 rounded-lg shadow-sm">
              <blockquote className="text-slate-700 italic mb-4">
                "Having a stable, affordable home has given our family the foundation we needed 
                to rebuild our lives. The community here feels like whānau—we look out for each other."
              </blockquote>
              <cite className="text-slate-500 text-sm">— Current resident (name withheld for privacy)</cite>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
