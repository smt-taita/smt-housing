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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Added mobile menu state

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
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center min-h-[64px] py-2">
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              <img src="/smt-logo.jpg" alt="St Matt's Logo" className="h-8 w-8 sm:h-10 sm:w-10 object-contain flex-shrink-0" />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-semibold text-slate-900 text-sm sm:text-lg leading-tight truncate">St Matt's Taitā Anglican Church</span>
                <span className="text-xs sm:text-sm text-slate-600">St Matt's Kāinga</span>
              </div>
            </div>

            {/* Desktop Navigation */}
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

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center flex-shrink-0 ml-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-church-blue hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-church-blue"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <span className="sr-only">Open main menu</span>
                {!mobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>

            <Button
              onClick={() => document.getElementById('help')?.scrollIntoView({ behavior: 'smooth' })}
              className="hidden md:inline-flex bg-church-amber text-white hover:bg-amber-600 transition-colors font-medium"
            >
              <i className="fas fa-heart mr-2"></i>Donate Now
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden bg-white border-t border-slate-200 pb-4 pt-2 px-2 space-y-1">
            <button
              onClick={() => { scrollToSection('story'); setMobileMenuOpen(false); }}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-church-blue hover:bg-slate-50 w-full text-left"
            >
              Our Story
            </button>
            <button
              onClick={() => { scrollToSection('help'); setMobileMenuOpen(false); }}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-church-blue hover:bg-slate-50 w-full text-left"
            >
              How to Help
            </button>
            <button
              onClick={() => { scrollToSection('impact'); setMobileMenuOpen(false); }}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-church-blue hover:bg-slate-50 w-full text-left"
            >
              Impact
            </button>
            <button
              onClick={() => { scrollToSection('contact'); setMobileMenuOpen(false); }}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-church-blue hover:bg-slate-50 w-full text-left"
            >
              Contact
            </button>
            <Button
              asChild
              className="w-full mt-2 bg-church-amber text-white hover:bg-amber-600 transition-colors font-medium"
            >
              <a href="mailto:housing@stmattstaita.org.nz?subject=Donation%20to%20St%20Matt's%20Kāinga&body=Hi,%0A%0AI%20would%20like%20to%20make%20a%20donation%20to%20support%20St%20Matt's%20Kāinga.%20Please%20let%20me%20know%20how%20to%20proceed.%0A%0AThank%20you">
                <i className="fas fa-heart mr-2"></i>Donate Now
              </a>
            </Button>
          </div>
        )}
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