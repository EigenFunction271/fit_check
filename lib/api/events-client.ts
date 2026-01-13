import { createClient } from '@/lib/supabase/client';
import { eventSchema, type EventInput } from '@/lib/validations';
import type { Event } from './types';
import { logDbOperation } from '@/lib/logger';

/**
 * Get all events (client-side)
 */
export async function getAllEventsClient(): Promise<{ events: Event[]; error: Error | null }> {
  try {
    const supabase = createClient();
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
 * Create a new event (client-side)
 */
export async function createEventClient(input: EventInput): Promise<{ event: Event | null; error: Error | null }> {
  try {
    const supabase = createClient();
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
 * Update an existing event (client-side)
 */
export async function updateEventClient(
  eventId: string,
  input: EventInput
): Promise<{ event: Event | null; error: Error | null }> {
  try {
    const supabase = createClient();
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
 * Delete an event (client-side)
 */
export async function deleteEventClient(eventId: string): Promise<{ error: Error | null }> {
  try {
    const supabase = createClient();
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
