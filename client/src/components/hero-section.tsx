import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressBar from "./progress-bar";
import { useCampaignData } from "@/hooks/use-campaign-data";

export default function HeroSection() {
  const [showVideo, setShowVideo] = useState(false);
  const { data: campaignSummary } = useCampaignData();

  const scrollToHelp = () => {
    const element = document.getElementById('help');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const playHeroVideo = () => {
    setShowVideo(true);
    // TODO: Load actual video URL when available
  };

  return (
    <section className="relative bg-gradient-to-br from-church-blue to-church-green hero-pattern min-h-screen flex items-center">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Column */}
          <div className="text-white space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              St Matt's Kāinga
              <span className="block text-church-amber">More Than Housing,</span>
              <span className="block">We're Building Community</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              Help us keep 8 warm, dry homes affordable for families in need. 
              Your support creates more than shelter—it builds hope and community in Taitā.
            </p>
            
            {/* Progress Bar */}
            {campaignSummary && (
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-30">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-lg">Campaign Progress</span>
                  <span className="text-church-amber font-bold">{campaignSummary.progressPercentage}%</span>
                </div>
                
                <ProgressBar 
                  current={campaignSummary.totalRaised} 
                  goal={campaignSummary.goal}
                  className="mb-4"
                />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-semibold">${campaignSummary.totalRaised.toLocaleString()}</div>
                    <div className="text-blue-100">Raised so far</div>
                  </div>
                  <div>
                    <div className="font-semibold">${campaignSummary.goal.toLocaleString()}</div>
                    <div className="text-blue-100">Annual goal</div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild
                className="bg-church-amber text-white hover:bg-amber-600 transition-all transform hover:scale-105 shadow-lg px-8 py-4 rounded-xl font-semibold text-lg"
              >
                <a href="mailto:housing@stmattstaita.org.nz?subject=Donation%20to%20St%20Matt's%20Kāinga&body=Hi,%0A%0AI%20would%20like%20to%20make%20a%20donation%20to%20support%20St%20Matt's%20Kāinga.%20Please%20let%20me%20know%20how%20to%20proceed.%0A%0AThank%20you">
                  <i className="fas fa-heart mr-2"></i>Support Our Community
                </a>
              </Button>
              
              <Button 
                onClick={playHeroVideo}
                className="bg-white bg-opacity-20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-church-blue transition-all px-8 py-4 rounded-xl font-semibold text-lg"
              >
                <i className="fas fa-play mr-2"></i>Watch Our Story
              </Button>
            </div>
          </div>
          
          {/* Video Column */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black">
              {!showVideo ? (
                <>
                  <img 
                    src="/community-main.jpg" 
                    alt="St Matt's housing community" 
                    className="w-full h-80 md:h-96 object-cover"
                  />
                  
                  <div className="absolute inset-0 video-overlay flex items-center justify-center">
                    <Button
                      onClick={playHeroVideo}
                      className="bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 rounded-full w-20 h-20 hover:bg-opacity-30 transition-all transform hover:scale-110"
                    >
                      <i className="fas fa-play text-white text-2xl ml-1"></i>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="w-full h-80 md:h-96">
                  <iframe 
                    className="w-full h-full" 
                    src="https://www.youtube.com/embed/9uPdUJL-YHg?autoplay=1" 
                    frameBorder="0" 
                    allowFullScreen
                    title="St Matt's Kāinga Story"
                  />
                </div>
              )}
            </div>
            
            
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <i className="fas fa-chevron-down text-white text-2xl"></i>
      </div>
    </section>
  );
}
