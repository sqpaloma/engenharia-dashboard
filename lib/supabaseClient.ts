import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: ReturnType<typeof createClient> | null = null;

if (typeof window !== "undefined" && supabaseUrl && supabaseAnonKey) {
  // Criar o cliente apenas no lado do cliente (no navegador)
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
