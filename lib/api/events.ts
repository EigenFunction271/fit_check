import { createClient } from '@/lib/supabase/server';
import { eventSchema, type EventInput } from '@/lib/validations';
import type { Event } from './types';
import { logDbOperation, logApiCall } from '@/lib/logger';

/**
 * Get all events (server-side)
 */
export async function getAllEvents(): Promise<{ events: Event[]; error: Error | null }> {
  try {
    const supabase = await createClient();
    const startTime = Date.now();

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date_time', { ascending: true });

    if (error) {
      logDbOperation({
        operation: 'select',
        table: 'events',
        query: {},
        error: new Error(error.message),
        duration: Date.now() - startTime,
      });
      return { events: [], error: new Error(error.message) };
    }

    logDbOperation({
      operation: 'select',
      table: 'events',
      query: {},
      result: data,
      duration: Date.now() - startTime,
    });

    return { events: (data as Event[]) || [], error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logDbOperation({
      operation: 'select',
      table: 'events',
      query: {},
      error,
    });
    return { events: [], error };
  }
}

/**
 * Get a single event by ID (server-side)
 */
export async function getEventById(eventId: string): Promise<{ event: Event | null; error: Error | null }> {
  try {
    const supabase = await createClient();
    const startTime = Date.now();

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error) {
      logDbOperation({
        operation: 'select',
        table: 'events',
        query: { id: eventId },
        error: new Error(error.message),
        duration: Date.now() - startTime,
      });
      return { event: null, error: new Error(error.message) };
    }

    logDbOperation({
      operation: 'select',
      table: 'events',
      query: { id: eventId },
      result: data,
      duration: Date.now() - startTime,
    });

    return { event: data as Event, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logDbOperation({
      operation: 'select',
      table: 'events',
      query: { id: eventId },
      error,
    });
    return { event: null, error };
  }
}

/**
 * Create a new event (server-side)
 */
export async function createEvent(input: EventInput): Promise<{ event: Event | null; error: Error | null }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { event: null, error: new Error('Not authenticated') };
    }

    // Validate input
    const validated = eventSchema.parse(input);
    const startTime = Date.now();

    const { data, error } = await supabase
      .from('events')
      .insert({
        title: validated.title,
        description: validated.description || null,
        date_time: validated.date_time,
        duration: validated.duration,
        max_capacity: validated.max_capacity,
        event_type: validated.event_type,
        location: validated.location || null,
        instructor_name: validated.instructor_name || null,
      })
      .select()
      .single();

    if (error) {
      logDbOperation({
        operation: 'insert',
        table: 'events',
        userId: user.id,
        query: validated,
        error: new Error(error.message),
        duration: Date.now() - startTime,
      });
      return { event: null, error: new Error(error.message) };
    }

    logDbOperation({
      operation: 'insert',
      table: 'events',
      userId: user.id,
      query: validated,
      result: data,
      duration: Date.now() - startTime,
    });

    return { event: data as Event, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logDbOperation({
      operation: 'insert',
      table: 'events',
      query: input,
      error,
    });
    return { event: null, error };
  }
}

/**
 * Update an existing event (server-side)
 */
export async function updateEvent(
  eventId: string,
  input: EventInput
): Promise<{ event: Event | null; error: Error | null }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { event: null, error: new Error('Not authenticated') };
    }

    // Validate input
    const validated = eventSchema.parse(input);
    const startTime = Date.now();

    const { data, error } = await supabase
      .from('events')
      .update({
        title: validated.title,
        description: validated.description || null,
        date_time: validated.date_time,
        duration: validated.duration,
        max_capacity: validated.max_capacity,
        event_type: validated.event_type,
        location: validated.location || null,
        instructor_name: validated.instructor_name || null,
      })
      .eq('id', eventId)
      .select()
      .single();

    if (error) {
      logDbOperation({
        operation: 'update',
        table: 'events',
        userId: user.id,
        query: { id: eventId, ...validated },
        error: new Error(error.message),
        duration: Date.now() - startTime,
      });
      return { event: null, error: new Error(error.message) };
    }

    logDbOperation({
      operation: 'update',
      table: 'events',
      userId: user.id,
      query: { id: eventId, ...validated },
      result: data,
      duration: Date.now() - startTime,
    });

    return { event: data as Event, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logDbOperation({
      operation: 'update',
      table: 'events',
      query: { id: eventId, ...input },
      error,
    });
    return { event: null, error };
  }
}

/**
 * Delete an event (server-side)
 */
export async function deleteEvent(eventId: string): Promise<{ error: Error | null }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: new Error('Not authenticated') };
    }

    const startTime = Date.now();

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) {
      logDbOperation({
        operation: 'delete',
        table: 'events',
        userId: user.id,
        query: { id: eventId },
        error: new Error(error.message),
        duration: Date.now() - startTime,
      });
      return { error: new Error(error.message) };
    }

    logDbOperation({
      operation: 'delete',
      table: 'events',
      userId: user.id,
      query: { id: eventId },
      result: { deleted: true },
      duration: Date.now() - startTime,
    });

    return { error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logDbOperation({
      operation: 'delete',
      table: 'events',
      query: { id: eventId },
      error,
    });
    return { error };
  }
}

/**
 * Get bookings for an event (server-side)
 */
export async function getEventBookings(eventId: string): Promise<{ bookings: any[]; error: Error | null }> {
  try {
    const supabase = await createClient();
    const startTime = Date.now();

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        users (
          id,
          name,
          email
        )
      `)
      .eq('event_id', eventId)
      .eq('status', 'confirmed')
      .order('booking_date', { ascending: false });

    if (error) {
      logDbOperation({
        operation: 'select',
        table: 'bookings',
        query: { event_id: eventId },
        error: new Error(error.message),
        duration: Date.now() - startTime,
      });
      return { bookings: [], error: new Error(error.message) };
    }

    logDbOperation({
      operation: 'select',
      table: 'bookings',
      query: { event_id: eventId },
      result: data,
      duration: Date.now() - startTime,
    });

    return { bookings: data || [], error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logDbOperation({
      operation: 'select',
      table: 'bookings',
      query: { event_id: eventId },
      error,
    });
    return { bookings: [], error };
  }
}
