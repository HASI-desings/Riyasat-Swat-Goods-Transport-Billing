// Single Supabase client instance. All data access in this app goes
// through this file + the hooks/ layer — never call Supabase directly
// from inside a page or component.
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const credentialsMissing = !url || !anonKey;

// If credentials are missing/invalid, we still export a client-shaped
// object so imports don't crash — App.jsx shows a dedicated setup error
// screen instead (see security.md — invalid Supabase credentials).
export const supabase = credentialsMissing
  ? null
  : createClient(url, anonKey, {
      auth: {
        persistSession: true, // keep the session in this browser across reloads
        autoRefreshToken: true, // silently renew the token so the session doesn't expire mid-use
        storage: window.localStorage, // survives closing the tab/app, tied to this device
        storageKey: 'rsgt-auth', // stable key so a rebuild/redeploy doesn't orphan the saved session
        detectSessionInUrl: false,
      },
    });

export async function checkSupabaseConnection() {
  if (!supabase) return { ok: false, reason: 'missing-credentials' };
  try {
    const { error } = await supabase.from('settings').select('id').limit(1);
    if (error) return { ok: false, reason: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: err.message || 'network-error' };
  }
}
