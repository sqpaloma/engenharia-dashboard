import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

// Função para obter o cliente Supabase, criando-o apenas no lado do cliente
export function getSupabaseClient(): SupabaseClient | null {
  if (typeof window !== "undefined" && supabaseUrl && supabaseAnonKey) {
    if (!supabase) {
      // Cria o cliente apenas uma vez no navegador
      supabase = createClient(supabaseUrl, supabaseAnonKey);
    }
    return supabase;
  }
  // Retorna null no server-side ou se as variáveis não estiverem definidas
  return null;
}
