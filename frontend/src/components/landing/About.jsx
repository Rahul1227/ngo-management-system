const About = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto container-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-slide-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-6">
              About Aarambh
            </h2>

            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p className="text-lg">
                <span className="font-semibold text-primary-600">Aarambh</span>{" "}
                (आरंभ) means "Beginning" - symbolizing the start of positive
                change and meaningful impact in our community.
              </p>

              <p>
                This platform is an{" "}
                <span className="font-semibold text-secondary-600">
                  NSS Initiative
                </span>{" "}
                designed to revolutionize how NGOs manage registrations and
                donations. We believe in complete transparency, data integrity,
                and ethical handling of contributions.
              </p>

              <p>
                Unlike traditional systems where user data is lost if donations
                aren't completed, Aarambh ensures that every registration is
                valued and preserved. We separate the registration process from
                donations, giving users the freedom to contribute when they're
                ready.
              </p>

              <p>
                Every rupee donated is tracked with complete transparency. Users
                can view their complete donation history - including successful,
                pending, and failed transactions - ensuring full accountability.
              </p>
            </div>

            {/* Key Points */}
            <div className="mt-8 space-y-3">
              {[
                "Registration data saved independently",
                "Real-time payment status tracking",
                "Secure Razorpay integration",
                "Admin dashboard for monitoring",
                "Export capabilities for transparency",
              ].map((point, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-primary-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image/Visual */}
          <div
            className="relative animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="relative">
              {/* Main Card */}
              <div className="card bg-gradient-to-br from-primary-500 to-secondary-600 text-white p-8 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src="/assets/images/logo.png"
                      alt="Aarambh Logo"
                      className="h-16 w-auto"
                    />
                    <div>
                      <h3 className="text-2xl font-heading font-bold">
                        Aarambh
                      </h3>
                      <p className="text-white/90">An NSS Initiative</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center py-3 border-b border-white/20">
                      <span className="text-white/90">Total Registrations</span>
                      <span className="text-2xl font-bold">500+</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-white/20">
                      <span className="text-white/90">Donations Raised</span>
                      <span className="text-2xl font-bold">₹50L+</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-white/90">Success Rate</span>
                      <span className="text-2xl font-bold">95%</span>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-md">
                        <p className="text-sm text-white/90 italic text-right">
                          "Making a difference, one contribution at a time. Join
                          us in creating positive change."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-white card w-32 h-32 flex flex-col items-center justify-center shadow-xl animate-pulse">
                <div className="text-3xl font-bold text-primary-600">100%</div>
                <div className="text-xs text-gray-600 text-center">
                  Transparent
                </div>
              </div>

              <div
                className="absolute -bottom-4 -left-4 bg-white card w-32 h-32 flex flex-col items-center justify-center shadow-xl animate-pulse"
                style={{ animationDelay: "1s" }}
              >
                <div className="text-3xl font-bold text-secondary-600">
                  24/7
                </div>
                <div className="text-xs text-gray-600 text-center">
                  Available
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NSS Info Section */}
        <div className="mt-20 card bg-gradient-to-r from-secondary-50 to-primary-50 border border-primary-200">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-4">
              National Service Scheme (NSS)
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              The National Service Scheme is a Central Sector Scheme of the
              Government of India, Ministry of Youth Affairs & Sports. It
              provides opportunities to students to understand the community in
              which they work and to understand themselves in relation to their
              community.
            </p>
            <p className="text-gray-600 italic">"NOT ME, BUT YOU"</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
