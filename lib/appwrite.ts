
import { createClient } from '@supabase/supabase-js';

// --- IMPORTANT ---
// This file configures the Supabase client.
// Despite the filename, this is for SUPABASE, not Appwrite.

const SUPABASE_CONFIG = {
    url: 'https://immmelhwandfkablhmwq.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltbW1lbGh3YW5kZmthYmxobXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMDMxODQsImV4cCI6MjA4NDY3OTE4NH0.n7R9SCGGRpiWjuJjK0knl2F2iryyCi65VyEfOBle-6I'
};

export const isSupabaseConfigured =
    !!SUPABASE_CONFIG.url &&
    SUPABASE_CONFIG.url !== 'PASTE_YOUR_PROJECT_URL_HERE' &&
    !!SUPABASE_CONFIG.anonKey &&
    SUPABASE_CONFIG.anonKey !== 'PASTE_YOUR_ANON_PUBLIC_KEY_HERE' &&
    SUPABASE_CONFIG.anonKey !== 'SUPABASE_CLIENT_API_KEY';

const supabase = isSupabaseConfigured 
    ? createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey)
    : {} as any; // Provide a dummy client if not configured

export { supabase };