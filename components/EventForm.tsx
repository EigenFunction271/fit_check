'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { eventSchema, type EventInput } from '@/lib/validations';
import { createEventClient, updateEventClient } from '@/lib/api/events-client';
import type { Event } from '@/lib/api/types';

interface EventFormProps {
  event?: Event;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function EventForm({ event, onSuccess, onCancel }: EventFormProps) {
  const router = useRouter();
  const isEditMode = !!event;

  // Initialize form data
  const [formData, setFormData] = useState<EventInput>({
    title: event?.title || '',
    description: event?.description || '',
    date_time: event?.date_time ? new Date(event.date_time).toISOString().slice(0, 16) : '',
    duration: event?.duration || 60,
    max_capacity: event?.max_capacity || 20,
    event_type: event?.event_type || 'cardio',
    location: event?.location || '',
    instructor_name: event?.instructor_name || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        date_time: new Date(event.date_time).toISOString().slice(0, 16),
        duration: event.duration,
        max_capacity: event.max_capacity,
        event_type: event.event_type,
        location: event.location || '',
        instructor_name: event.instructor_name || '',
      });
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);

    try {
      // Convert datetime-local format to ISO string
      const submitData: EventInput = {
        ...formData,
        date_time: new Date(formData.date_time).toISOString(),
        duration: Number(formData.duration),
        max_capacity: Number(formData.max_capacity),
        description: formData.description || undefined,
        location: formData.location || undefined,
        instructor_name: formData.instructor_name || undefined,
      };

      // Validate
      const validated = eventSchema.parse(submitData);

      // Create or update
      let result;
      if (isEditMode && event) {
        result = await updateEventClient(event.id, validated);
      } else {
        result = await createEventClient(validated);
      }

      if (result.error) {
        setError(result.error.message);
        setLoading(false);
        return;
      }

      // Success
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/admin/events');
        router.refresh();
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (err && typeof err === 'object' && 'issues' in err) {
        // Zod validation errors
        const zodError = err as { issues: Array<{ path: string[]; message: string }> };
        const errors: Record<string, string> = {};
        zodError.issues.forEach((issue) => {
          const field = issue.path[0];
          if (field) {
            errors[field] = issue.message;
          }
        });
        setFieldErrors(errors);
        setError('Please fix the errors below');
      } else {
        setError('An unexpected error occurred');
      }
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
          Event Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-gray-900 ${
            fieldErrors.title ? 'border-red-300' : 'border-gray-200'
          }`}
          placeholder="Morning Yoga Session"
          required
        />
        {fieldErrors.title && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-gray-900"
          placeholder="Describe the event..."
        />
      </div>

      {/* Date and Time */}
      <div>
        <label htmlFor="date_time" className="block text-sm font-semibold text-gray-700 mb-2">
          Date & Time <span className="text-red-500">*</span>
        </label>
        <input
          type="datetime-local"
          id="date_time"
          value={formData.date_time}
          onChange={(e) => setFormData({ ...formData, date_time: e.target.value })}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-gray-900 ${
            fieldErrors.date_time ? 'border-red-300' : 'border-gray-200'
          }`}
          required
        />
        {fieldErrors.date_time && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.date_time}</p>
        )}
      </div>

      {/* Duration and Max Capacity */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="duration" className="block text-sm font-semibold text-gray-700 mb-2">
            Duration (minutes) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="duration"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
            min="1"
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-gray-900 ${
              fieldErrors.duration ? 'border-red-300' : 'border-gray-200'
            }`}
            required
          />
          {fieldErrors.duration && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.duration}</p>
          )}
        </div>

        <div>
          <label htmlFor="max_capacity" className="block text-sm font-semibold text-gray-700 mb-2">
            Max Capacity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="max_capacity"
            value={formData.max_capacity}
            onChange={(e) => setFormData({ ...formData, max_capacity: Number(e.target.value) })}
            min="1"
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-gray-900 ${
              fieldErrors.max_capacity ? 'border-red-300' : 'border-gray-200'
            }`}
            required
          />
          {fieldErrors.max_capacity && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.max_capacity}</p>
          )}
        </div>
      </div>

      {/* Event Type */}
      <div>
        <label htmlFor="event_type" className="block text-sm font-semibold text-gray-700 mb-2">
          Event Type <span className="text-red-500">*</span>
        </label>
        <select
          id="event_type"
          value={formData.event_type}
          onChange={(e) => setFormData({ ...formData, event_type: e.target.value as EventInput['event_type'] })}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-gray-900 ${
            fieldErrors.event_type ? 'border-red-300' : 'border-gray-200'
          }`}
          required
        >
          <option value="cardio">Cardio</option>
          <option value="strength">Strength Training</option>
          <option value="yoga">Yoga</option>
          <option value="pilates">Pilates</option>
          <option value="crossfit">CrossFit</option>
          <option value="other">Other</option>
        </select>
        {fieldErrors.event_type && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.event_type}</p>
        )}
      </div>

      {/* Location and Instructor */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-gray-900"
            placeholder="Room 101"
          />
        </div>

        <div>
          <label htmlFor="instructor_name" className="block text-sm font-semibold text-gray-700 mb-2">
            Instructor Name
          </label>
          <input
            type="text"
            id="instructor_name"
            value={formData.instructor_name}
            onChange={(e) => setFormData({ ...formData, instructor_name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-gray-900"
            placeholder="John Doe"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isEditMode ? 'Updating...' : 'Creating...'}
            </span>
          ) : (
            isEditMode ? 'Update Event' : 'Create Event'
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
