export default function StorySection() {
  return (
    <section id="story" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">A Village of Welcome</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-church-blue to-church-green mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-slate-700 leading-relaxed">
              What was once just a patch of grass has transformed into a thriving community of hope. 
              Our 8 beautiful homes—1 four-bedroom, 3 two-bedroom, and 4 one-bedroom units—now house 
              families, a former refugee, and people transitioning from temporary housing.
            </p>

            <p className="text-lg text-slate-700 leading-relaxed">
              Two of our church leaders live onsite as community catalysts, fostering connections 
              and support among residents. This isn't just about providing housing—we're building 
              relationships, stability, and genuine community.
            </p>

            <div className="bg-slate-50 rounded-xl p-6 border-l-4 border-church-green">
              <p className="text-slate-700 italic">
                "St Matt's Kāinga is part of the Anglican Diocese's Bedrock Housing initiative, 
                demonstrating our commitment to practical Christian care in our communities."
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="text-center">
                <div className="bg-church-blue bg-opacity-20 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <i className="fas fa-map-marker-alt text-church-blue text-2xl"></i>
                </div>
                <div className="text-3xl font-bold text-church-blue mb-2">8</div>
                <div className="text-slate-600">Homes Provided</div>
              </div>
              <div className="text-center">
                <div className="bg-church-green bg-opacity-20 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <i className="fas fa-users text-church-green text-2xl"></i>
                </div>
                <div className="text-3xl font-bold text-church-green mb-2">7</div>
                <div className="text-slate-600">Lives Impacted</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <img 
              src="/community-small2.jpg" 
              alt="St Matt's Kāinga housing with welcome sign" 
              className="rounded-xl shadow-lg w-full h-80 object-cover"
              loading="lazy"
              decoding="async"
              width="800"
              height="320"
            />

            <div className="grid grid-cols-2 gap-4">
              <img 
                src="/community-small1.jpg" 
                alt="St Matt's Kāinga housing community" 
                className="rounded-lg shadow-md w-full h-32 object-cover"
                loading="lazy"
                decoding="async"
                width="400"
                height="128"
              />

              <img 
                src="/community-main.jpg" 
                alt="Community gathering at St Matt's housing project" 
                className="rounded-lg shadow-md w-full h-32 object-cover"
                loading="lazy"
                decoding="async"
                width="400"
                height="128"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}