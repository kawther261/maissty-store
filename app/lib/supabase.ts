import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("SUPABASE_URL:", supabaseUrl ? "Loaded" : "Missing");
console.log("SERVICE_ROLE_KEY:", serviceRoleKey ? "Loaded" : "Missing");

export const supabase = createClient(
  supabaseUrl!,
  serviceRoleKey!
);