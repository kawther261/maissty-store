import { createClient } from "@supabase/supabase-js";

// 🔌 Variables avec clés directes de secours (Bypasse les bugs de variables Vercel)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gzrqogsktjgzasplslfp.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_PoYmlnas7nNjpY9HLluWKQ_zVseiP4i";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);