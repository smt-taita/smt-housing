import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertContactSubmissionSchema } from "@shared/schema";
import { z } from "zod";

const contactFormSchema = insertContactSubmissionSchema.extend({
  amount: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  onSuccess?: () => void;
}

export default function ContactForm({ onSuccess }: ContactFormProps) {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: undefined,
      frequency: undefined,
      message: "",
    },
  });

  const submitContactForm = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return apiRequest("POST", "/api/contact-submissions", data);
    },
    onSuccess: () => {
      toast({
        title: "Thank you for your interest!",
        description: "We've received your inquiry and will be in touch soon.",
      });
      setIsSubmitted(true);
      form.reset();
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit your inquiry. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    submitContactForm.mutate(data);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto text-center p-8 bg-white rounded-xl shadow-lg border-2 border-church-green">
        <div className="bg-church-green bg-opacity-20 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
          <i className="fas fa-check text-church-green text-2xl"></i>
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Thank You!</h3>
        <p className="text-slate-700 mb-6">
          We've received your inquiry and someone from our team will be in touch with you soon.
        </p>
        <Button 
          onClick={() => setIsSubmitted(false)}
          variant="outline"
          className="border-church-blue text-church-blue hover:bg-church-blue hover:text-white"
        >
          Submit Another Inquiry
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-6">
        <div className="bg-church-blue bg-opacity-20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <i className="fas fa-heart text-church-blue text-2xl"></i>
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Get in Touch</h3>
        <p className="text-slate-600">
          Interested in supporting our housing project? We'd love to hear from you.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Your full name" 
                    {...field} 
                    data-testid="input-contact-name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address *</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="your@email.com" 
                    {...field} 
                    data-testid="input-contact-email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Potential Donation Amount (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g., 100" 
                    {...field} 
                    data-testid="input-contact-amount"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Donation Frequency (Optional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                  <FormControl>
                    <SelectTrigger data-testid="select-contact-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                    <SelectItem value="one-time">One-time</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell us about your interest in supporting the project..."
                    rows={3}
                    {...field}
                    value={field.value || ""}
                    data-testid="input-contact-message"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            disabled={submitContactForm.isPending}
            className="w-full bg-church-blue text-white hover:bg-blue-700 font-medium py-3"
            data-testid="button-contact-submit"
          >
            {submitContactForm.isPending ? "Sending..." : "Send Inquiry"}
          </Button>
        </form>
      </Form>

      <p className="text-xs text-slate-500 text-center mt-4">
        We respect your privacy and will only use your information to respond to your inquiry.
      </p>
    </div>
  );
}