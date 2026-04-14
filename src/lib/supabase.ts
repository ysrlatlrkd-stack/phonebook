import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co"; // Valid URL format for build
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  if (process.env.NODE_ENV !== "production") {
    console.warn("Supabase credentials are missing. Please check your .env.local file.");
  }
} else if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.startsWith('eyJ')) {
  if (process.env.NODE_ENV !== "production") {
    console.warn("WARNING: Your Supabase Anon Key format looks unusual. Standard keys usually start with 'eyJ'. Please verify your keys in the Supabase Dashboard.");
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
