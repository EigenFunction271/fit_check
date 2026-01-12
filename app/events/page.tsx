import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUserProfile } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export default async function EventsPage() {
  const { user, error } = await getUserProfile();

  if (error || !user) {
    redirect('/login');
  }

  const supabase = await createClient();

  // Get all upcoming events
  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select('*')
    .gte('date_time', new Date().toISOString())
    .order('date_time', { ascending: true });

  // Get user's bookings to show which events they're already booked for
  const { data: userBookings } = await supabase
    .from('bookings')
    .select('event_id')
    .eq('user_id', user.id)
    .eq('status', 'confirmed');

  const bookedEventIds = new Set(userBookings?.map((b) => b.event_id) || []);

  // Get booking counts for each event
  const eventIds = events?.map((e) => e.id) || [];
  const { data: bookingCounts } = await supabase
    .from('bookings')
    .select('event_id')
    .in('event_id', eventIds)
    .eq('status', 'confirmed');

  const countsByEventId = new Map<string, number>();
  bookingCounts?.forEach((booking) => {
    const current = countsByEventId.get(booking.event_id) || 0;
    countsByEventId.set(booking.event_id, current + 1);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Workout Events</h1>
            <p className="text-gray-600">Book your next fitness session</p>
          </div>
          <Link
            href="/dashboard"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {eventsError ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error loading events: {eventsError.message}
          </div>
        ) : null}

        {events && events.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const bookingCount = countsByEventId.get(event.id) || 0;
              const isBooked = bookedEventIds.has(event.id);
              const spotsRemaining = event.max_capacity - bookingCount;
              const isFull = spotsRemaining <= 0;

              return (
                <div
                  key={event.id}
                  id={`event-${event.id}`}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-indigo-600">{event.title}</h3>
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-indigo-100 text-indigo-800">
                      {event.event_type}
                    </span>
                  </div>

                  {event.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">Date:</span>
                      <span>{new Date(event.date_time).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">Time:</span>
                      <span>{new Date(event.date_time).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">Duration:</span>
                      <span>{event.duration} minutes</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center text-gray-600">
                        <span className="font-medium mr-2">Location:</span>
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.instructor_name && (
                      <div className="flex items-center text-gray-600">
                        <span className="font-medium mr-2">Instructor:</span>
                        <span>{event.instructor_name}</span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">Capacity:</span>
                      <span>
                        {bookingCount}/{event.max_capacity} spots filled
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    {isBooked ? (
                      <div className="bg-green-100 text-green-800 px-4 py-2 rounded text-center font-medium">
                        ✓ You&apos;re booked!
                      </div>
                    ) : isFull ? (
                      <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded text-center font-medium">
                        Fully booked
                      </div>
                    ) : (
                      <Link
                        href={`/events/book/${event.id}`}
                        className="block w-full bg-indigo-600 text-white px-4 py-2 rounded text-center hover:bg-indigo-700 transition-colors font-medium"
                      >
                        Book Now
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No upcoming events scheduled.</p>
            <p className="text-gray-400 mt-2">Check back later for new workout sessions!</p>
          </div>
        )}
      </div>
    </div>
  );
}
