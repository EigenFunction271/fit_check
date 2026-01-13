import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUserProfile, isAdmin } from '@/lib/auth';
import EventForm from '@/components/EventForm';

export default async function NewEventPage() {
  const { user, error } = await getUserProfile();

  if (error || !user) {
    redirect('/login');
  }

  // Check if user is admin
  const admin = await isAdmin();
  if (!admin) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-3">
            Create New <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Event</span>
          </h1>
          <p className="text-lg text-gray-600">Fill in the details below to create a new workout event</p>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft p-8 border border-gray-100 max-w-3xl">
          <EventForm />
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
