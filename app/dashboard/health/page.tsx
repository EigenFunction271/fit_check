'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { HealthMetric } from '@/lib/api/types';
import HealthMetricsForm from '@/components/HealthMetricsForm';
import HealthMetricsChart from '@/components/HealthMetricsChart';

export default function HealthMetricsPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadMetrics();
  }, []);

  async function loadMetrics() {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    const { data, error: fetchError } = await supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', user.id)
      .order('recorded_date', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    setMetrics((data || []) as HealthMetric[]);
    setLoading(false);
  }

  const handleFormSuccess = () => {
    setShowForm(false);
    loadMetrics(); // Reload metrics after successful submission
  };

  const latestMetric = metrics.length > 0 ? metrics[0] : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading health metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-10">
          <Link
            href="/dashboard"
            className="text-indigo-600 hover:text-indigo-700 mb-4 inline-flex items-center gap-2 font-semibold transition-colors"
          >
            <span>←</span> Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-5xl font-extrabold text-gray-900 mb-3">Health Metrics</h1>
              <p className="text-lg text-gray-600">Track and visualize your health data over time</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transform hover:-translate-y-0.5"
            >
              {showForm ? 'Cancel' : '+ Add Metrics'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Add Metrics Form */}
        {showForm && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft-lg p-8 mb-8 border border-gray-100 animate-scale-in">
            <h2 className="text-2xl font-bold mb-6 text-indigo-600">Add Health Metrics</h2>
            <HealthMetricsForm onSuccess={handleFormSuccess} />
          </div>
        )}

        {/* Latest Metrics Summary */}
        {latestMetric && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft p-8 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-indigo-600">Latest Metrics</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {latestMetric.grip_strength !== null && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Grip Strength</p>
                  <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{latestMetric.grip_strength} <span className="text-lg text-gray-500">kg</span></p>
                </div>
              )}
              {latestMetric.bone_density !== null && (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Bone Density</p>
                  <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">{latestMetric.bone_density} <span className="text-lg text-gray-500">g/cm²</span></p>
                </div>
              )}
              {latestMetric.pushup_count !== null && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Pushups</p>
                  <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">{latestMetric.pushup_count}</p>
                </div>
              )}
              {latestMetric.heart_rate !== null && (
                <div className="bg-gradient-to-br from-red-50 to-orange-50 p-5 rounded-xl border border-red-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Heart Rate</p>
                  <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">{latestMetric.heart_rate} <span className="text-lg text-gray-500">bpm</span></p>
                </div>
              )}
              {latestMetric.body_fat !== null && (
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-xl border border-emerald-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Body Fat</p>
                  <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">{latestMetric.body_fat}<span className="text-lg text-gray-500">%</span></p>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Recorded: {new Date(latestMetric.recorded_date).toLocaleDateString()} at{' '}
              {new Date(latestMetric.recorded_date).toLocaleTimeString()}
            </p>
          </div>
        )}

        {/* Charts */}
        {metrics.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <HealthMetricsChart
              metrics={metrics}
              metricType="grip_strength"
              title="Grip Strength"
              unit="kg"
            />
            <HealthMetricsChart
              metrics={metrics}
              metricType="bone_density"
              title="Bone Density"
              unit="g/cm²"
            />
            <HealthMetricsChart
              metrics={metrics}
              metricType="pushup_count"
              title="Pushup Count"
            />
            <HealthMetricsChart
              metrics={metrics}
              metricType="heart_rate"
              title="Heart Rate"
              unit="bpm"
            />
            <HealthMetricsChart
              metrics={metrics}
              metricType="body_fat"
              title="Body Fat Percentage"
              unit="%"
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No health metrics recorded yet.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              Add Your First Entry
            </button>
          </div>
        )}

        {/* Historical Data Table */}
        {metrics.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft p-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-indigo-600">Historical Data</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grip Strength
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bone Density
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pushups
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Heart Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Body Fat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {metrics.map((metric) => (
                    <tr key={metric.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(metric.recorded_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {metric.grip_strength !== null ? `${metric.grip_strength} kg` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {metric.bone_density !== null ? `${metric.bone_density} g/cm²` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {metric.pushup_count !== null ? metric.pushup_count : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {metric.heart_rate !== null ? `${metric.heart_rate} bpm` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {metric.body_fat !== null ? `${metric.body_fat}%` : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {metric.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
