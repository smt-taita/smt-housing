import { Button } from "@/components/ui/button";

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Get in Touch</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-church-blue to-church-green mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="text-center mb-6">
              <div className="bg-church-blue bg-opacity-20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <i className="fas fa-envelope text-church-blue text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Direct Contact</h3>
              <p className="text-slate-600">
                Ready to make a donation or have questions? Get in touch directly.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <i className="fas fa-envelope text-church-amber"></i>
                <div>
                  <div className="font-medium text-slate-900">Email</div>
                  <a 
                    href="mailto:housing@stmattstaita.org.nz" 
                    className="text-church-blue hover:text-church-green transition-colors"
                  >
                    housing@stmattstaita.org.nz
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <i className="fas fa-map-marker-alt text-church-amber"></i>
                <div>
                  <div className="font-medium text-slate-900">Location</div>
                  <div className="text-slate-600">Taitā, Lower Hutt, Wellington</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <i className="fas fa-church text-church-amber"></i>
                <div>
                  <div className="font-medium text-slate-900">Parish</div>
                  <div className="text-slate-600">St Matt's Taitā Anglican Church</div>
                </div>
              </div>
            </div>

            <Button 
              asChild
              className="w-full mt-6 bg-church-amber text-white hover:bg-amber-600 transition-colors font-medium"
            >
              <a href="mailto:housing@stmattstaita.org.nz?subject=Donation%20to%20St%20Matt's%20Kāinga&body=Hi,%0A%0AI%20would%20like%20to%20make%20a%20donation%20to%20support%20St%20Matt's%20Kāinga.%20Please%20let%20me%20know%20how%20to%20proceed.%0A%0AThank%20you">
                <i className="fas fa-heart mr-2"></i>Email Us to Donate
              </a>
            </Button>
          </div>

          {/* Donation Form Option */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="text-center mb-6">
              <div className="bg-church-green bg-opacity-20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <i className="fas fa-hand-holding-heart text-church-green text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Donate Now</h3>
              <p className="text-slate-600">
                Use our donation form to make a one-time or regular contribution.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <i className="fas fa-check text-church-green"></i>
                <span className="text-slate-700">Set up monthly or annual giving</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-check text-church-green"></i>
                <span className="text-slate-700">Make a one-time donation</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-check text-church-green"></i>
                <span className="text-slate-700">Choose your donation amount</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-check text-church-green"></i>
                <span className="text-slate-700">Secure and easy to complete</span>
              </div>
            </div>

            <Button 
              asChild
              className="w-full bg-church-green text-white hover:bg-green-700 transition-colors font-medium"
              data-testid="button-donate-now"
            >
              <a 
                href="https://docs.google.com/forms/d/e/1FAIpQLSeRgySdjbRm8iVWoHISdlhI7V2pd0zLX2kDIny54VyqHIKfng/viewform?usp=header"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fas fa-heart mr-2"></i>Donate Now
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}