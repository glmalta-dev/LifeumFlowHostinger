import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabaseConfig";

export const supabase = isSupabaseConfigured
  ? createClient()
  : null;
