import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-orange-50"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl"></div>
      </div>

      <div className="container text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-surface-200 shadow-card mb-8">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-sm font-medium text-surface-600">AI-Powered E-Commerce Analytics</span>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-surface-900 leading-[1.1] mb-6 tracking-tight">
          Smarter Pricing.<br/>
          <span className="bg-gradient-to-r from-brand-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">Better Decisions.</span>
        </h1>

        <p className="text-lg md:text-xl text-surface-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Compare prices across platforms, analyze customer reviews, and forecast demand — all powered by AI.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/login"
            className="px-8 py-3.5 bg-surface-900 text-white font-semibold rounded-xl hover:bg-surface-800 transition-all shadow-lg hover:shadow-xl text-base"
          >
            Get Started Free
          </Link>
          <Link
            to="/dashboard"
            className="px-8 py-3.5 bg-white text-surface-700 font-semibold rounded-xl border border-surface-200 hover:border-surface-300 hover:bg-surface-50 transition-all shadow-card text-base"
          >
            View Dashboard →
          </Link>
        </div>

        {/* Stats row */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 lg:gap-16">
          {[
            { value: "7+", label: "E-commerce Platforms" },
            { value: "AI", label: "Demand Forecasting" },
            { value: "Real-time", label: "Price Tracking" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-surface-900">{stat.value}</div>
              <div className="text-sm text-surface-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;