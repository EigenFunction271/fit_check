'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Booking } from '@/lib/api/types';

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadBookings() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select(`
          *,
          events (
            id,
            title,
            date_time,
            duration,
            event_type,
            location,
            instructor_name
          )
        `)
        .eq('user_id', user.id)
        .order('booking_date', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      setBookings((data || []) as Booking[]);
      setLoading(false);
    }

    loadBookings();
  }, [router]);

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCancellingId(bookingId);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError('Not authenticated');
      setCancellingId(null);
      return;
    }

    // Get booking with event details to check 24-hour policy
    const { data: booking } = await supabase
      .from('bookings')
      .select(`
        *,
        events (
          date_time
        )
      `)
      .eq('id', bookingId)
      .eq('user_id', user.id)
      .eq('status', 'confirmed')
      .single();

    if (!booking) {
      setError('Booking not found');
      setCancellingId(null);
      return;
    }

    const eventDate = new Date((booking.events as any).date_time);
    const now = new Date();
    const hoursUntilEvent = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Check 24-hour cancellation policy
    if (hoursUntilEvent < 24) {
      setError('Cancellations must be made at least 24 hours before the event');
      setCancellingId(null);
      return;
    }

    // Cancel booking
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)
      .eq('user_id', user.id);

    if (updateError) {
      setError(updateError.message);
      setCancellingId(null);
      return;
    }

    // Remove cancelled booking from list
    setBookings(bookings.filter(b => b.id !== bookingId));
    setCancellingId(null);
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  const upcomingBookings = bookings.filter(b => {
    if (b.status !== 'confirmed') return false;
    const eventDate = new Date((b.events as any)?.date_time || b.booking_date);
    return eventDate >= new Date();
  });

  const pastBookings = bookings.filter(b => {
    if (b.status !== 'confirmed') return false;
    const eventDate = new Date((b.events as any)?.date_time || b.booking_date);
    return eventDate < new Date();
  });

  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

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
          <h1 className="text-5xl font-extrabold text-gray-900 mb-3">My Bookings</h1>
          <p className="text-lg text-gray-600">Manage your workout session bookings</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Upcoming Bookings */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-indigo-600">Upcoming Bookings</h2>
          {upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => {
                const event = booking.events as any;
                const eventDate = new Date(event?.date_time || booking.booking_date);
                const hoursUntilEvent = (eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60);
                const canCancel = hoursUntilEvent >= 24;

                return (
                  <div key={booking.id} className="border-b border-gray-100 pb-5 last:border-b-0 last:pb-0 hover:bg-gray-50/50 -mx-2 px-4 py-3 rounded-xl transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-indigo-600 mb-2">{event?.title || 'Event'}</h3>
                        <p className="text-gray-600">
                          {eventDate.toLocaleDateString()} at {eventDate.toLocaleTimeString()}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {event?.event_type} • {event?.location || 'TBA'}
                        </p>
                        {event?.instructor_name && (
                          <p className="text-sm text-gray-500">Instructor: {event.instructor_name}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          Duration: {event?.duration || 'N/A'} minutes
                        </p>
                      </div>
                      <div className="ml-4">
                        {canCancel ? (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            disabled={cancellingId === booking.id}
                            className="px-5 py-2.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 disabled:opacity-50 text-sm font-semibold border border-red-200 hover:border-red-300 shadow-sm hover:shadow-md"
                          >
                            {cancellingId === booking.id ? 'Cancelling...' : 'Cancel'}
                          </button>
                        ) : (
                          <div className="px-5 py-2.5 bg-gray-50 text-gray-500 rounded-xl text-sm text-center border border-gray-200 font-medium">
                            Cannot cancel<br />(&lt; 24h)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No upcoming bookings. <Link href="/events" className="text-indigo-600 hover:underline">Browse events</Link> to book a session!</p>
          )}
        </div>

        {/* Past Bookings */}
        {pastBookings.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft p-8 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-indigo-600">Past Bookings</h2>
            <div className="space-y-4">
              {pastBookings.map((booking) => {
                const event = booking.events as any;
                const eventDate = new Date(event?.date_time || booking.booking_date);

                return (
                  <div key={booking.id} className="border-b pb-4 last:border-b-0 opacity-75">
                    <h3 className="font-semibold text-lg text-indigo-600 mb-1">{event?.title || 'Event'}</h3>
                    <p className="text-gray-600">
                      {eventDate.toLocaleDateString()} at {eventDate.toLocaleTimeString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {event?.event_type} • {event?.location || 'TBA'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cancelled Bookings */}
        {cancelledBookings.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft p-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-indigo-600">Cancelled Bookings</h2>
            <div className="space-y-4">
              {cancelledBookings.map((booking) => {
                const event = booking.events as any;
                const eventDate = new Date(event?.date_time || booking.booking_date);

                return (
                  <div key={booking.id} className="border-b pb-4 last:border-b-0 opacity-60">
                    <h3 className="font-semibold text-lg text-gray-500 mb-1 line-through">{event?.title || 'Event'}</h3>
                    <p className="text-gray-500">
                      {eventDate.toLocaleDateString()} at {eventDate.toLocaleTimeString()}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {event?.event_type} • Cancelled
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
