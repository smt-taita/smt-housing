import HeroSection from "@/components/hero-section";
import StorySection from "@/components/story-section";
import ChallengeSection from "@/components/challenge-section";
import DonationSection from "@/components/donation-section";
import ImpactSection from "@/components/impact-section";
import FaqSection from "@/components/faq-section";
import AdminDashboard from "@/components/admin-dashboard";
import Footer from "@/components/footer";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [showAdmin, setShowAdmin] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src="/smt-logo.jpg" alt="St Matt's Logo" className="h-8 w-8 object-contain" />
              <span className="font-semibold text-slate-900 text-lg">St Matt's Kāinga</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => scrollToSection('story')} 
                className="text-slate-700 hover:text-church-blue transition-colors"
              >
                Our Story
              </button>
              <button 
                onClick={() => scrollToSection('help')} 
                className="text-slate-700 hover:text-church-blue transition-colors"
              >
                How to Help
              </button>
              <button 
                onClick={() => scrollToSection('impact')} 
                className="text-slate-700 hover:text-church-blue transition-colors"
              >
                Impact
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="text-slate-700 hover:text-church-blue transition-colors"
              >
                Contact
              </button>
            </div>
            
            <Button 
              asChild
              className="bg-church-amber text-white hover:bg-amber-600 transition-colors font-medium"
            >
              <a href="mailto:housing@stmattstaita.org.nz?subject=Donation%20to%20St%20Matt's%20Kāinga&body=Hi,%0A%0AI%20would%20like%20to%20make%20a%20donation%20to%20support%20St%20Matt's%20Kāinga.%20Please%20let%20me%20know%20how%20to%20proceed.%0A%0AThank%20you">
                <i className="fas fa-heart mr-2"></i>Donate Now
              </a>
            </Button>
          </div>
        </div>
      </nav>

      <HeroSection />
      <StorySection />
      <ChallengeSection />
      <DonationSection />
      <ImpactSection />
      <FaqSection />
      
      {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} />}
      
      <Footer onShowAdmin={() => setShowAdmin(true)} />
      
      {/* Sticky Donation Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={() => scrollToSection('help')}
          className="bg-church-amber text-white hover:bg-amber-600 transition-all transform hover:scale-105 shadow-2xl rounded-full px-6 py-3 flex items-center space-x-2"
        >
          <i className="fas fa-heart"></i>
          <span className="hidden sm:inline">Donate Now</span>
        </Button>
      </div>
    </div>
  );
}
