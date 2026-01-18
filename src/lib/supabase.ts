import { createClient } from '@supabase/supabase-js'

/**
 * Variáveis de ambiente do Supabase
 * Configure no .env.local:
 * VITE_SUPABASE_URL=your-project-url
 * VITE_SUPABASE_ANON_KEY=your-anon-key
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local'
  )
}

/**
 * Cliente Supabase configurado para o projeto
 * Singleton para garantir uma única instância
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

/**
 * Tipos gerados do Supabase (serão gerados após migrations)
 * Execute: npx supabase gen types typescript --project-id your-project-id > src/types/supabase.ts
 */
// export type Database = ...
