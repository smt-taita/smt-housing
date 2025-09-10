interface FooterProps {
  onShowAdmin: () => void;
}

export default function Footer({ onShowAdmin }: FooterProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };



  return (
    <footer id="contact" className="bg-slate-900 text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - St Matt's Info */}
          <div className="space-y-6">
            <div>
              <span className="font-bold text-white text-xl">St Matt's Taitā Anglican Church</span>
            </div>
            
            <p className="text-slate-400 leading-relaxed">
              More than homes—we're building hope. Supporting affordable housing 
              and strong communities in Taitā, Lower Hutt.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <i className="fas fa-envelope text-church-amber w-4"></i>
                <a 
                  href="mailto:housing@stmattstaita.org.nz" 
                  className="hover:text-white transition-colors text-sm"
                  data-testid="link-email"
                >
                  housing@stmattstaita.org.nz
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <i className="fas fa-map-marker-alt text-church-amber w-4"></i>
                <span className="text-sm">Taitā, Lower Hutt, Wellington</span>
              </div>
              

            </div>
          </div>
          
          {/* Center Column - Logo & Mission */}
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="bg-white rounded-full p-6 shadow-lg">
              <img 
                src="/smt-logo.jpg" 
                alt="St Matt's Logo" 
                className="w-20 h-20 object-contain"
              />
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-white">Our Mission</h4>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                Creating pathways to stable, affordable housing while fostering 
                strong, connected communities in our neighborhood.
              </p>
            </div>
          </div>
          
          {/* Right Column - Quick Links */}
          <div className="space-y-8">
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => scrollToSection('story')} 
                    className="hover:text-white transition-colors text-sm block"
                    data-testid="button-navigate-story"
                  >
                    Our Story
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('help')} 
                    className="hover:text-white transition-colors text-sm block"
                    data-testid="button-navigate-help"
                  >
                    How to Help
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('impact')} 
                    className="hover:text-white transition-colors text-sm block"
                    data-testid="button-navigate-impact"
                  >
                    Your Impact
                  </button>
                </li>
                <li>
                  <button 
                    onClick={onShowAdmin} 
                    className="hover:text-white transition-colors text-sm block"
                    data-testid="button-admin"
                  >
                    Admin Portal
                  </button>
                </li>
              </ul>
            </div>
            
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="text-slate-400 text-sm space-y-1">
              <p>&copy; 2025 St Matt's Kāinga. Part of the Anglican Diocese of Wellington.</p>
              <p>AI powered tech support provided by Malcolm @ <a href="mailto:malcolm@optimi.co.nz" className="text-white hover:text-slate-300 underline">Optimi</a></p>
            </div>
            
            <div className="flex items-center justify-center lg:justify-end space-x-4">
              <span className="text-slate-400 text-sm">Powered by faith, hope, and community</span>
              <div className="w-8 h-8 bg-church-amber bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-cross text-church-amber text-sm"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
