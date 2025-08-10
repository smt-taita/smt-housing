import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";

interface FooterProps {
  onShowAdmin: () => void;
}

export default function Footer({ onShowAdmin }: FooterProps) {
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm<{ email: string }>();

  const subscribeNewsletter = useMutation({
    mutationFn: async (data: { email: string }) => {
      return apiRequest("POST", "/api/newsletter/signup", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Thank you for subscribing to updates! You will receive quarterly progress reports.",
      });
      trackEvent('newsletter_signup', 'engagement', 'footer');
      reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: { email: string }) => {
    subscribeNewsletter.mutate(data);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
    trackEvent('share', 'social', 'facebook_footer');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent("St Matt's Kāinga - Community Housing Project");
    const body = encodeURIComponent("I wanted to share this important fundraising campaign with you. St Matt's Taitā is working to keep 8 homes affordable for families in need. Learn more: " + window.location.href);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    trackEvent('share', 'social', 'email_footer');
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent("Help St Matt's Taitā keep affordable homes available for families in need: " + window.location.href);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    trackEvent('share', 'social', 'whatsapp_footer');
  };

  return (
    <footer id="contact" className="bg-slate-900 text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <i className="fas fa-home text-church-amber text-2xl"></i>
              <span className="font-bold text-white text-xl">St Matt's Kāinga</span>
            </div>
            
            <p className="text-slate-400 mb-6 max-w-md">
              More than homes—we're building hope. Supporting affordable housing 
              and strong communities in Taitā, Lower Hutt.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <i className="fas fa-envelope text-church-amber"></i>
                <a 
                  href="mailto:housing@stmattstaita.org.nz" 
                  className="hover:text-white transition-colors"
                >
                  housing@stmattstaita.org.nz
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <i className="fas fa-map-marker-alt text-church-amber"></i>
                <span>Taitā, Lower Hutt, Wellington</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('story')} 
                  className="hover:text-white transition-colors"
                >
                  Our Story
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('help')} 
                  className="hover:text-white transition-colors"
                >
                  How to Help
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('impact')} 
                  className="hover:text-white transition-colors"
                >
                  Your Impact
                </button>
              </li>
              <li>
                <button onClick={onShowAdmin} className="hover:text-white transition-colors">
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Connect With Us</h4>
            
            {/* Newsletter Signup */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mb-6">
              <Input
                {...register("email", { required: true })}
                type="email"
                placeholder="Your email for updates"
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:ring-church-amber focus:border-transparent"
              />
              <Button 
                type="submit" 
                className="w-full bg-church-amber text-white hover:bg-amber-600"
                disabled={subscribeNewsletter.isPending}
              >
                {subscribeNewsletter.isPending ? "Subscribing..." : "Subscribe to Updates"}
              </Button>
            </form>
            
            <div className="flex space-x-4">
              <Button 
                onClick={shareOnFacebook}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 p-3"
              >
                <i className="fab fa-facebook-f"></i>
              </Button>
              <Button 
                onClick={shareViaEmail}
                size="sm"
                className="bg-slate-600 hover:bg-slate-700 p-3"
              >
                <i className="fas fa-envelope"></i>
              </Button>
              <Button 
                onClick={shareOnWhatsApp}
                size="sm"
                className="bg-green-600 hover:bg-green-700 p-3"
              >
                <i className="fab fa-whatsapp"></i>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-slate-400 text-sm">
            <p>&copy; 2024 St Matt's Taitā. Part of the Anglican Diocese of Wellington.</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-slate-400 text-sm">Powered by faith, hope, and community</span>
            <div className="w-8 h-8 bg-church-amber bg-opacity-20 rounded-full flex items-center justify-center">
              <i className="fas fa-cross text-church-amber text-sm"></i>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
