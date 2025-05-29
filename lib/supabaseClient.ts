import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL =
  "https://mhydbrcxlighxarbnhyv.supabase.co");
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oeWRicmN4bGlnaHhhcmJuaHl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MDc3OTQsImV4cCI6MjA2NDA4Mzc5NH0.F-gB2Hl9ZJW9drV2UVlRvUpIzpKmHXDfLiLmqnMaIbQ");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
