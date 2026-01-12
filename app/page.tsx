import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20 animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Health & Fitness
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Research Study
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join our research study and track your fitness journey. Book workout sessions,
              monitor your health metrics, and contribute to important health research.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <Link
                href="/register"
                className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/50 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold border-2 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-indigo-600 transition-colors">Book Sessions</h3>
              <p className="text-gray-600 leading-relaxed">
                View and book available workout sessions that fit your schedule.
              </p>
            </div>
            <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-indigo-600 transition-colors">Track Metrics</h3>
              <p className="text-gray-600 leading-relaxed">
                Record and visualize your health metrics over time.
              </p>
            </div>
            <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-indigo-600 transition-colors">Research Impact</h3>
              <p className="text-gray-600 leading-relaxed">
                Contribute to important health and fitness research.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center pt-8 border-t border-gray-200">
            <p className="text-gray-500">
              Questions? Contact us at{' '}
              <a href="mailto:support@researchstudy.com" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                support@researchstudy.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
