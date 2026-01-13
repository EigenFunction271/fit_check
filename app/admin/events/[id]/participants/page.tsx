import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUserProfile, isAdmin } from '@/lib/auth';
import { getEventById, getEventBookings } from '@/lib/api/events';

interface EventParticipantsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EventParticipantsPage({ params }: EventParticipantsPageProps) {
  const { user, error } = await getUserProfile();

  if (error || !user) {
    redirect('/login');
  }

  // Check if user is admin
  const admin = await isAdmin();
  if (!admin) {
    redirect('/dashboard');
  }

  // Await params (Next.js 15)
  const { id } = await params;

  // Get the event
  const { event, error: eventError } = await getEventById(id);

  if (eventError || !event) {
    redirect('/admin/events');
  }

  // Get bookings for this event
  const { bookings, error: bookingsError } = await getEventBookings(id);

  if (bookingsError) {
    console.error('Error fetching bookings:', bookingsError);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-3">
            Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Participants</span>
          </h1>
          <p className="text-lg text-gray-600">{event.title}</p>
        </div>

        {/* Event Details */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft p-6 mb-6 border border-gray-100">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-700">Date & Time:</span>{' '}
              <span className="text-gray-600">
                {new Date(event.date_time).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Capacity:</span>{' '}
              <span className="text-gray-600">
                {bookings?.length || 0} / {event.max_capacity} booked
              </span>
            </div>
            {event.location && (
              <div>
                <span className="font-semibold text-gray-700">Location:</span>{' '}
                <span className="text-gray-600">{event.location}</span>
              </div>
            )}
            {event.instructor_name && (
              <div>
                <span className="font-semibold text-gray-700">Instructor:</span>{' '}
                <span className="text-gray-600">{event.instructor_name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Participants List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-indigo-600 mb-6">
            Participants ({bookings?.length || 0})
          </h2>
          {bookings && bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking: any) => {
                const participant = booking.users;
                return (
                  <div
                    key={booking.id}
                    className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0 hover:bg-gray-50/50 -mx-2 px-3 py-2 rounded-lg transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-indigo-600 mb-1">
                          {participant?.name || 'Unknown User'}
                        </h3>
                        <p className="text-gray-600">{participant?.email || 'No email'}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Booked on {new Date(booking.booking_date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-3 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">
                        {booking.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No participants booked yet</p>
            </div>
          )}
        </div>

        {/* Back link */}
        <div className="mt-6">
          <Link
            href="/admin/events"
            className="text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            ← Back to Events
          </Link>
        </div>
      </div>
    </div>
  );
}
