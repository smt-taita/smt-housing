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



  return (
    <footer id="contact" className="bg-slate-900 text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - St Matt's Info */}
          <div>
            <div className="mb-6">
              <span className="font-bold text-white text-xl">St Matt's Kāinga</span>
            </div>
            
            <p className="text-slate-400 mb-6">
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
          
          {/* Center Column - Logo */}
          <div className="flex justify-center items-start">
            <div className="bg-white rounded-full p-6 shadow-lg">
              <img 
                src="/smt-logo.jpg" 
                alt="St Matt's Logo" 
                className="w-24 h-24 object-contain"
              />
            </div>
          </div>
          
          {/* Right Column - Quick Links */}
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
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-slate-400 text-sm">
            <p>&copy; 2025 St Matt's Kāinga. Part of the Anglican Diocese of Wellington.</p>
            <p className="mt-1 text-center">AI powered tech support provided by Malcolm @ <a href="mailto:malcolm@optimi.co.nz" className="text-white hover:text-slate-300 underline">Optimi</a></p>
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
