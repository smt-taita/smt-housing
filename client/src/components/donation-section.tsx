import { Button } from "@/components/ui/button";

export default function DonationSection() {
  return (
    <section id="help" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Join Our Village of Support</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            We need 20 donors giving $100 monthly to reach our goal. Every contribution,
            large or small, makes a real difference in keeping families housed.
          </p>

          {/* Temporary donation contact info */}
          <div className="bg-white rounded-xl p-8 max-w-2xl mx-auto border-2 border-church-blue shadow-lg">
            <h3 className="text-2xl font-bold text-church-blue mb-4">Ready to Support Us?</h3>
            <p className="text-lg text-slate-800 mb-6">
              To let us know what you'd like to contribute, please enter the form below.
            </p>
            <Button
              asChild
              className="bg-church-amber text-white hover:bg-amber-600 transition-all transform hover:scale-105 shadow-lg px-8 py-4 rounded-xl font-semibold text-lg"
            >
              <a 
                href="https://docs.google.com/forms/d/e/1FAIpQLSeRgySdjbRm8iVWoHISdlhI7V2pd0zLX2kDIny54VyqHIKfng/viewform?usp=header"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fas fa-heart mr-2"></i>Contact Us to Donate
              </a>
            </Button>
          </div>
        </div>


        {/* Other Ways to Support */}
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Other Ways to Support</h3>

            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-church-blue bg-opacity-20 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-praying-hands text-church-blue text-lg"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Prayer Support</h4>
                  <p className="text-slate-600">Join our prayer network for residents and the project's future.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-slate-50 to-amber-50 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-church-amber bg-opacity-20 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-share-alt text-church-amber text-lg"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Share with Networks</h4>
                  <p className="text-slate-600">Help us reach more potential supporters in your community.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-slate-50 to-green-50 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-church-green bg-opacity-20 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-handshake text-church-green text-lg"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Workplace Partnerships</h4>
                  <p className="text-slate-600">Connect your church or workplace for group giving opportunities.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="flex items-center">
            <div className="bg-white border-l-4 border-church-green p-6 rounded-lg shadow-sm">
              <blockquote className="text-slate-700 italic mb-4">
                "This isn't just housing. It's a taste of the Kingdom of God. It's a chance to offer the welcome of Christ to those who need it most."
              </blockquote>
              <cite className="text-slate-500 text-sm">— Rev Maria Kirkland, Co-Missioner St Matt's Taitā</cite>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}