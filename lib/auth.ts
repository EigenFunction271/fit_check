import { createClient } from '@/lib/supabase/server';

export type UserRole = 'participant' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone_number: string | null;
  id_number: string | null;
  role: UserRole;
}

/**
 * Get the current user's profile including their role
 */
export async function getUserProfile(): Promise<{ user: UserProfile | null; error: Error | null }> {
  try {
    const supabase = await createClient();
    
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authUser) {
      return { user: null, error: authError ? new Error(authError.message) : new Error('Not authenticated') };
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id, email, name, phone_number, id_number, role')
      .eq('id', authUser.id)
      .single();

    if (profileError || !profile) {
      return { user: null, error: profileError ? new Error(profileError.message) : new Error('Profile not found') };
    }

    return { user: profile as UserProfile, error: null };
  } catch (err) {
    return { user: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  const { user } = await getUserProfile();
  return user?.role === 'admin';
}
