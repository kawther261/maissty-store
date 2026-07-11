import { createClient } from '@supabase/supabase-js';

// On récupère les variables (et on accepte les deux variantes de noms pour éviter les fautes de frappe)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// 💡 FIX DE GÉNIE : Si Next.js compile à blanc sur Vercel sans les variables, 
// on utilise un placeholder temporaire pour ne PAS faire planter le build.
const finalUrl = supabaseUrl || 'https://placeholder-project.supabase.co';
const finalKey = supabaseKey || 'placeholder-temporary-anon-key';

if (!supabaseUrl || !supabaseKey) {
  console.warn("⚠️ Attention : Les variables Supabase sont introuvables en mode compilation locale.");
}

export const supabase = createClient(finalUrl, finalKey);