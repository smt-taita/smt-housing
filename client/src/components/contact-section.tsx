import { Button } from "@/components/ui/button";

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Get in Touch</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-church-blue to-church-green mx-auto rounded-full"></div>
        </div>

        <div className="flex justify-center">
          {/* Contact Information */}
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-md">
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

          </div>

        </div>
      </div>
    </section>
  );
}