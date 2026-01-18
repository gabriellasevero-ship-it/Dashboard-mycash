import { createClient } from '@supabase/supabase-js'

/**
 * Variáveis de ambiente do Supabase
 * Configure no .env.local:
 * VITE_SUPABASE_URL=your-project-url
 * VITE_SUPABASE_ANON_KEY=your-anon-key
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Aviso no console se as variáveis não estiverem configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local'
  )
  console.warn(
    '⚠️ A aplicação funcionará com dados mock até que o Supabase seja configurado.'
  )
}

/**
 * Cliente Supabase configurado para o projeto
 * Singleton para garantir uma única instância
 * Usa valores padrão se as variáveis não estiverem configuradas (para desenvolvimento)
 */
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
)

// Verifica se Supabase está configurado
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

/**
 * Tipos gerados do Supabase (serão gerados após migrations)
 * Execute: npx supabase gen types typescript --project-id your-project-id > src/types/supabase.ts
 */
// export type Database = ...
