'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { HealthMetric } from '@/lib/api/types';

interface HealthMetricsChartProps {
  metrics: HealthMetric[];
  metricType: 'grip_strength' | 'bone_density' | 'pushup_count' | 'heart_rate' | 'body_fat';
  title: string;
  unit?: string;
}

export default function HealthMetricsChart({ metrics, metricType, title, unit }: HealthMetricsChartProps) {
  // Filter and format data for chart
  const chartData = metrics
    .filter(m => m[metricType] !== null && m[metricType] !== undefined)
    .map(m => ({
      date: new Date(m.recorded_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: m[metricType],
      fullDate: m.recorded_date,
    }))
    .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());

  if (chartData.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-indigo-600 mb-4">{title}</h3>
        <p className="text-gray-500 text-center py-8">No data available for this metric</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-indigo-600 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip 
            formatter={(value: number) => [`${value}${unit ? ` ${unit}` : ''}`, title]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#4f46e5" 
            strokeWidth={2}
            name={title}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
