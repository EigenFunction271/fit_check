import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUserProfile, isAdmin } from '@/lib/auth';
import { getAllEvents, getEventBookings } from '@/lib/api/events';
import { createClient } from '@/lib/supabase/server';
import DeleteEventButton from './DeleteEventButton';

export default async function AdminEventsPage() {
  const { user, error } = await getUserProfile();

  if (error || !user) {
    redirect('/login');
  }

  // Check if user is admin
  const admin = await isAdmin();
  if (!admin) {
    redirect('/dashboard');
  }

  // Get all events
  const { events, error: eventsError } = await getAllEvents();

  if (eventsError) {
    console.error('Error fetching events:', eventsError);
  }

  // Get booking counts for each event
  const supabase = await createClient();
  const eventIds = events.map(e => e.id);
  const bookingCounts: Record<string, number> = {};

  if (eventIds.length > 0) {
    const { data: bookings } = await supabase
      .from('bookings')
      .select('event_id')
      .in('event_id', eventIds)
      .eq('status', 'confirmed');

    if (bookings) {
      bookings.forEach(booking => {
        bookingCounts[booking.event_id] = (bookingCounts[booking.event_id] || 0) + 1;
      });
    }
  }

  // Separate past and upcoming events
  const now = new Date();
  const upcomingEvents = events.filter(e => new Date(e.date_time) >= now);
  const pastEvents = events.filter(e => new Date(e.date_time) < now);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-extrabold text-gray-900 mb-3">
                Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Management</span>
              </h1>
              <p className="text-lg text-gray-600">Create, edit, and manage workout events</p>
            </div>
            <Link
              href="/admin/events/new"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/20"
            >
              + Create Event
            </Link>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-indigo-600 mb-6">Upcoming Events ({upcomingEvents.length})</h2>
          {upcomingEvents.length > 0 ? (
            <div className="grid gap-6">
              {upcomingEvents.map((event) => {
                const bookingCount = bookingCounts[event.id] || 0;
                const isFull = bookingCount >= event.max_capacity;
                return (
                  <div
                    key={event.id}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft p-6 border border-gray-100 hover:shadow-soft-lg transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-indigo-600">{event.title}</h3>
                          <span className="px-2 py-1 text-xs font-semibold rounded bg-indigo-100 text-indigo-800">
                            {event.event_type}
                          </span>
                          {isFull && (
                            <span className="px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800">
                              Full
                            </span>
                          )}
                        </div>
                        {event.description && (
                          <p className="text-gray-600 mb-3">{event.description}</p>
                        )}
                        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-semibold">Date & Time:</span>{' '}
                            {new Date(event.date_time).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                          <div>
                            <span className="font-semibold">Duration:</span> {event.duration} minutes
                          </div>
                          <div>
                            <span className="font-semibold">Capacity:</span>{' '}
                            {bookingCount} / {event.max_capacity} booked
                          </div>
                          {event.location && (
                            <div>
                              <span className="font-semibold">Location:</span> {event.location}
                            </div>
                          )}
                          {event.instructor_name && (
                            <div>
                              <span className="font-semibold">Instructor:</span> {event.instructor_name}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Link
                          href={`/admin/events/${event.id}/edit`}
                          className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-semibold hover:bg-indigo-200 transition-colors text-center"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/admin/events/${event.id}/participants`}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors text-center"
                        >
                          View Participants ({bookingCount})
                        </Link>
                        <DeleteEventButton eventId={event.id} eventTitle={event.title} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft p-12 border border-gray-100 text-center">
              <p className="text-gray-500 text-lg mb-4">No upcoming events</p>
              <Link
                href="/admin/events/new"
                className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                Create Your First Event
              </Link>
            </div>
          )}
        </div>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-indigo-600 mb-6">Past Events ({pastEvents.length})</h2>
            <div className="grid gap-6">
              {pastEvents.map((event) => {
                const bookingCount = bookingCounts[event.id] || 0;
                return (
                  <div
                    key={event.id}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft p-6 border border-gray-100 opacity-75"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-600">{event.title}</h3>
                          <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-600">
                            {event.event_type}
                          </span>
                        </div>
                        {event.description && (
                          <p className="text-gray-500 mb-3">{event.description}</p>
                        )}
                        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-500">
                          <div>
                            <span className="font-semibold">Date & Time:</span>{' '}
                            {new Date(event.date_time).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                          <div>
                            <span className="font-semibold">Participants:</span> {bookingCount}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Link
                          href={`/admin/events/${event.id}/participants`}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors text-center"
                        >
                          View Participants ({bookingCount})
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Back to Admin Dashboard */}
        <div className="mt-10">
          <Link
            href="/admin"
            className="text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            ← Back to Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
