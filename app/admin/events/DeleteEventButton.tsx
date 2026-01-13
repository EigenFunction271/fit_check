'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteEventClient } from '@/lib/api/events-client';

interface DeleteEventButtonProps {
  eventId: string;
  eventTitle: string;
}

export default function DeleteEventButton({ eventId, eventTitle }: DeleteEventButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await deleteEventClient(eventId);

      if (deleteError) {
        setError(deleteError.message);
        setLoading(false);
        return;
      }

      // Success - refresh the page
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setLoading(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Delete</h3>
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete &quot;{eventTitle}&quot;? This action cannot be undone.
          </p>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
            <button
              onClick={() => {
                setShowConfirm(false);
                setError(null);
              }}
              disabled={loading}
              className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors text-center"
    >
      Delete
    </button>
  );
}
