import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Health & Fitness Research Study
          </h1>
          <p className="text-xl text-gray-700 mb-12">
            Join our research study and track your fitness journey. Book workout sessions,
            monitor your health metrics, and contribute to important health research.
          </p>
          
          <div className="flex gap-4 justify-center mb-16">
            <Link
              href="/register"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Register
            </Link>
            <Link
              href="/login"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              Login
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-indigo-600">Book Sessions</h3>
              <p className="text-gray-600">
                View and book available workout sessions that fit your schedule.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-indigo-600">Track Metrics</h3>
              <p className="text-gray-600">
                Record and visualize your health metrics over time.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-indigo-600">Research Impact</h3>
              <p className="text-gray-600">
                Contribute to important health and fitness research.
              </p>
            </div>
          </div>

          <div className="mt-16 text-gray-600">
            <p>Questions? Contact us at support@researchstudy.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
