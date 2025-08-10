import { useCampaignData } from "@/hooks/use-campaign-data";

export default function ChallengeSection() {
  const { data: campaignSummary } = useCampaignData();

  return (
    <section className="py-20 bg-gradient-to-br from-slate-100 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Why We Need Your Help</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-church-blue to-church-green mx-auto rounded-full"></div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="bg-red-100 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <i className="fas fa-clock text-red-600 text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Time is Running Out</h3>
            <p className="text-slate-600">
              Early subsidies end in <strong>early 2026</strong>. We need to secure ongoing funding 
              by January 2026 to keep homes affordable.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="bg-church-amber bg-opacity-20 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <i className="fas fa-dollar-sign text-church-amber text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">$24,000 Annual Need</h3>
            <p className="text-slate-600">
              This amount provides crucial rent relief, focusing on one-bedroom units 
              for our lowest-income tenants.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="bg-church-blue bg-opacity-20 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <i className="fas fa-home text-church-blue text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Families at Risk</h3>
            <p className="text-slate-600">
              Without ongoing support, some of our most vulnerable residents 
              may need to leave their homes and community.
            </p>
          </div>
        </div>
        
        {/* Urgency Timeline */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-900">Campaign Timeline</h3>
            <div className="text-red-600 font-semibold">
              <i className="fas fa-calendar-alt mr-2"></i>
              {campaignSummary ? `${campaignSummary.daysRemaining} days remaining` : 'Loading...'}
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200"></div>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="bg-church-green rounded-full w-6 h-6 flex items-center justify-center mr-6">
                  <i className="fas fa-check text-white text-sm"></i>
                </div>
                <div>
                  <div className="font-medium text-slate-900">November 2024 - Campaign Launch</div>
                  <div className="text-slate-600">Begin fundraising for ongoing subsidies</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="bg-church-amber rounded-full w-6 h-6 flex items-center justify-center mr-6">
                  <div className="bg-white rounded-full w-2 h-2"></div>
                </div>
                <div>
                  <div className="font-medium text-slate-900">January 2026 - Critical Deadline</div>
                  <div className="text-slate-600">Must secure $24,000 annual commitment</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="border-2 border-slate-300 rounded-full w-6 h-6 flex items-center justify-center mr-6">
                  <div className="bg-slate-300 rounded-full w-2 h-2"></div>
                </div>
                <div>
                  <div className="font-medium text-slate-900">Early 2026 - Subsidies End</div>
                  <div className="text-slate-600">Without funding, rent increases begin</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
