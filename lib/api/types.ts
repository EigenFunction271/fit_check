// Shared types for API responses

export interface HealthMetric {
  id: string;
  user_id: string;
  recorded_date: string;
  grip_strength: number | null;
  bone_density: number | null;
  pushup_count: number | null;
  heart_rate: number | null;
  body_fat: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  event_id: string;
  booking_date: string;
  status: 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
  events?: {
    id: string;
    title: string;
    date_time: string;
    duration: number;
    event_type: string;
    location: string | null;
    instructor_name: string | null;
  };
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  date_time: string;
  duration: number;
  max_capacity: number;
  event_type: 'cardio' | 'strength' | 'yoga' | 'pilates' | 'crossfit' | 'other';
  location: string | null;
  instructor_name: string | null;
  created_at: string;
  updated_at: string;
}
