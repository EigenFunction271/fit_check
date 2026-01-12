import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUserProfile, isAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export default async function AdminDashboardPage() {
  const { user, error } = await getUserProfile();

  if (error || !user) {
    redirect('/login');
  }

  // Check if user is admin
  const admin = await isAdmin();
  if (!admin) {
    redirect('/dashboard');
  }

  const supabase = await createClient();

  // Get statistics
  const { count: totalParticipants } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'participant');

  const { count: totalEvents } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true });

  const { count: totalBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'confirmed');

  // Get recent events
  const { data: recentEvents } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  // Get recent participants
  const { data: recentParticipants } = await supabase
    .from('users')
    .select('id, name, email, created_at')
    .eq('role', 'participant')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage events, participants, and view analytics</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Participants</h3>
            <p className="text-3xl font-bold text-indigo-600">{totalParticipants || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Events</h3>
            <p className="text-3xl font-bold text-indigo-600">{totalEvents || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Active Bookings</h3>
            <p className="text-3xl font-bold text-indigo-600">{totalBookings || 0}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            href="/admin/events"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-2 text-indigo-600">Manage Events</h3>
            <p className="text-gray-600 text-sm">Create, edit, and delete workout events</p>
          </Link>
          <Link
            href="/admin/participants"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-2 text-indigo-600">Participants</h3>
            <p className="text-gray-600 text-sm">View and manage participants</p>
          </Link>
          <Link
            href="/admin/analytics"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-2 text-indigo-600">Analytics</h3>
            <p className="text-gray-600 text-sm">View detailed analytics and reports</p>
          </Link>
          <Link
            href="/dashboard"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-2 text-indigo-600">User View</h3>
            <p className="text-gray-600 text-sm">Switch to participant view</p>
          </Link>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-indigo-600">Recent Events</h2>
            <Link
              href="/admin/events"
              className="text-indigo-600 hover:underline text-sm"
            >
              View All →
            </Link>
          </div>
          {recentEvents && recentEvents.length > 0 ? (
            <div className="space-y-4">
              {recentEvents.map((event) => (
                <div key={event.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-indigo-600">{event.title}</h3>
                      <p className="text-gray-600">
                        {new Date(event.date_time).toLocaleDateString()} at{' '}
                        {new Date(event.date_time).toLocaleTimeString()}
                      </p>
                      <p className="text-sm text-gray-500">{event.event_type} • {event.location || 'TBA'}</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-indigo-100 text-indigo-800">
                      {event.event_type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No events created yet.</p>
          )}
        </div>

        {/* Recent Participants */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-indigo-600">Recent Participants</h2>
            <Link
              href="/admin/participants"
              className="text-indigo-600 hover:underline text-sm"
            >
              View All →
            </Link>
          </div>
          {recentParticipants && recentParticipants.length > 0 ? (
            <div className="space-y-4">
              {recentParticipants.map((participant) => (
                <div key={participant.id} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-semibold text-lg text-indigo-600">{participant.name}</h3>
                  <p className="text-gray-600">{participant.email}</p>
                  <p className="text-sm text-gray-500">
                    Joined {new Date(participant.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No participants yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
