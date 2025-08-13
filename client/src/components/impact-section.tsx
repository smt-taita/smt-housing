import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

export default function ImpactSection() {
  const [donationAmount, setDonationAmount] = useState([100]);

  const monthly = donationAmount[0];
  const annual = monthly * 12;
  const taxCredit = Math.round(annual * 0.3333);
  const homesHelped = Math.max(1, Math.floor(annual / 3000));

  return (
    <section id="impact" className="py-20 bg-gradient-to-br from-slate-100 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Your Impact</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-church-blue to-church-green mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-church-green bg-opacity-20 rounded-full w-12 h-12 flex items-center justify-center">
                    <i className="fas fa-receipt text-church-green text-xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Tax Deductible</h3>
                </div>
                <p className="text-slate-700 mb-4">
                  All donations are tax-deductible in New Zealand. You'll receive a 
                  <strong> 33.33% IRD tax credit</strong> on your donation amount.
                </p>
                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-church-green">
                  <p className="text-green-800 font-medium">
                    Example: $100 monthly donation = $33.33 monthly tax credit
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-church-blue bg-opacity-20 rounded-full w-12 h-12 flex items-center justify-center">
                    <i className="fas fa-chart-line text-church-blue text-xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Regular Updates</h3>
                </div>
                <p className="text-slate-700 mb-4">
                  Receive quarterly updates showing exactly how your donations are making a difference:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-center">
                    <i className="fas fa-check text-church-green mr-3"></i>Resident success stories
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-church-green mr-3"></i>Financial transparency reports
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-church-green mr-3"></i>Community project updates
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-church-green mr-3"></i>Future planning insights
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center">
                    <i className="fas fa-users text-green-600 text-xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Community Building</h3>
                </div>
                <p className="text-slate-700">
                  The project is carefully managed by the Anglican Diocese of Wellington, 
                  ensuring responsible stewardship of all donations and transparent reporting to supporters.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
                    <i className="fas fa-recycle text-blue-600 text-xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Sustainable Model</h3>
                </div>
                <p className="text-slate-700 mb-4">
                  This project is part of the Anglican Diocese of Wellington's broader 
                  commitment to addressing housing inequality in our communities.
                </p>
                <a 
                  href="mailto:housing@stmattstaita.org.nz" 
                  className="inline-flex items-center text-church-blue hover:text-church-green transition-colors font-medium"
                >
                  <i className="fas fa-envelope mr-2"></i>
                  housing@stmattstaita.org.nz
                </a>
              </CardContent>
            </Card>

            {/* Impact Calculator */}
            <div className="bg-gradient-to-br from-church-blue to-church-green rounded-xl p-8 text-white">
              <h3 className="text-xl font-semibold mb-4">Impact Calculator</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-blue-100 mb-2">Monthly Donation Amount (NZD)</label>
                  <Slider
                    value={donationAmount}
                    onValueChange={setDonationAmount}
                    max={200}
                    min={20}
                    step={10}
                    className="w-full"
                  />
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold mb-2">${monthly}/month</div>
                  <div className="text-blue-100">Your annual contribution: ${annual.toLocaleString()}</div>
                  <div className="text-blue-100">Tax credit (33.33%): ${taxCredit.toLocaleString()}</div>
                  <div className="text-yellow-200 font-semibold mt-2 bg-black bg-opacity-30 rounded-md px-3 py-1">
                    Helps secure housing for {homesHelped} household{homesHelped > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}