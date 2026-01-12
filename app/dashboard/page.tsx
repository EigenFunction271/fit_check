import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUserProfile } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const { user, error } = await getUserProfile();

  if (error || !user) {
    redirect('/login');
  }

  // Redirect admins to admin dashboard
  if (user.role === 'admin') {
    redirect('/admin');
  }

  const supabase = await createClient();

  // Get user's bookings
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      id,
      status,
      booking_date,
      events (
        id,
        title,
        date_time,
        duration,
        event_type,
        location
      )
    `)
    .eq('user_id', user.id)
    .eq('status', 'confirmed')
    .order('booking_date', { ascending: false })
    .limit(5);

  // Get upcoming events
  const { data: upcomingEvents } = await supabase
    .from('events')
    .select('*')
    .gte('date_time', new Date().toISOString())
    .order('date_time', { ascending: true })
    .limit(5);

  // Get latest health metrics
  const { data: latestMetrics } = await supabase
    .from('health_metrics')
    .select('*')
    .eq('user_id', user.id)
    .order('recorded_date', { ascending: false })
    .limit(1)
    .single();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome, {user.name}!</h1>
          <p className="text-gray-600">Your health & fitness research dashboard</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/events"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2 text-indigo-600">Browse Events</h3>
            <p className="text-gray-600">View and book workout sessions</p>
          </Link>
          <Link
            href="/dashboard/health"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2 text-indigo-600">Health Metrics</h3>
            <p className="text-gray-600">Track your health data</p>
          </Link>
          <Link
            href="/dashboard/bookings"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2 text-indigo-600">My Bookings</h3>
            <p className="text-gray-600">View your scheduled sessions</p>
          </Link>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Recent Bookings</h2>
          {bookings && bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking: any) => (
                <div key={booking.id} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-semibold text-lg text-indigo-600">{booking.events?.title}</h3>
                  <p className="text-gray-600">
                    {new Date(booking.events?.date_time).toLocaleDateString()} at{' '}
                    {new Date(booking.events?.date_time).toLocaleTimeString()}
                  </p>
                  <p className="text-sm text-gray-500">{booking.events?.event_type} • {booking.events?.location}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No bookings yet. <Link href="/events" className="text-indigo-600 hover:underline">Browse events</Link> to get started!</p>
          )}
        </div>

        {/* Latest Health Metrics */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Latest Health Metrics</h2>
          {latestMetrics ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {latestMetrics.grip_strength !== null && (
                <div>
                  <p className="text-sm text-gray-500">Grip Strength</p>
                  <p className="text-2xl font-semibold">{latestMetrics.grip_strength}</p>
                </div>
              )}
              {latestMetrics.bone_density !== null && (
                <div>
                  <p className="text-sm text-gray-500">Bone Density</p>
                  <p className="text-2xl font-semibold">{latestMetrics.bone_density}</p>
                </div>
              )}
              {latestMetrics.pushup_count !== null && (
                <div>
                  <p className="text-sm text-gray-500">Pushups</p>
                  <p className="text-2xl font-semibold">{latestMetrics.pushup_count}</p>
                </div>
              )}
              {latestMetrics.heart_rate !== null && (
                <div>
                  <p className="text-sm text-gray-500">Heart Rate</p>
                  <p className="text-2xl font-semibold">{latestMetrics.heart_rate} bpm</p>
                </div>
              )}
              {latestMetrics.body_fat !== null && (
                <div>
                  <p className="text-sm text-gray-500">Body Fat</p>
                  <p className="text-2xl font-semibold">{latestMetrics.body_fat}%</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">
              No health metrics recorded yet. <Link href="/dashboard/health" className="text-indigo-600 hover:underline">Add your first entry</Link>
            </p>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Upcoming Events</h2>
          {upcomingEvents && upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.map((event: any) => (
                <div key={event.id} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-semibold text-lg text-indigo-600">{event.title}</h3>
                  <p className="text-gray-600">
                    {new Date(event.date_time).toLocaleDateString()} at{' '}
                    {new Date(event.date_time).toLocaleTimeString()}
                  </p>
                  <p className="text-sm text-gray-500">{event.event_type} • {event.location || 'TBA'}</p>
                  <Link
                    href={`/events#event-${event.id}`}
                    className="text-indigo-600 hover:underline text-sm mt-2 inline-block"
                  >
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No upcoming events scheduled.</p>
          )}
        </div>
      </div>
    </div>
  );
}
