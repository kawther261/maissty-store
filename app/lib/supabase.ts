import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "https://placeholder.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key";

console.log("SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL ? "Loaded" : "Missing");
console.log("SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "Loaded" : "Missing");

export const supabase = createClient(supabaseUrl, serviceRoleKey);