import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { isSupabaseConfigured } from '@/lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const { signIn, signUp } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    // Verificar se Supabase está configurado
    if (!isSupabaseConfigured) {
      setError(
        'Supabase não está configurado. Por favor, configure as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env.local'
      )
      return
    }

    setLoading(true)

    try {
      if (isSignUp) {
        await signUp(email, password, name || undefined)
        // Após signup bem-sucedido, redireciona para o dashboard
        navigate('/')
      } else {
        await signIn(email, password)
        // Após login bem-sucedido, redireciona para o dashboard
        navigate('/')
      }
    } catch (err: any) {
      // Tratamento de erros específicos do Supabase
      if (err.message?.includes('Failed to fetch') || err.message?.includes('Network')) {
        setError('Erro de conexão. Verifique se o Supabase está configurado corretamente e se a URL está acessível.')
      } else if (err.message?.includes('Invalid login credentials')) {
        setError('Email ou senha incorretos.')
      } else if (err.message?.includes('Email not confirmed')) {
        setError('Por favor, verifique seu email para confirmar sua conta.')
      } else {
        setError(err.message || 'Erro ao realizar autenticação')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src="/logo-mycash.svg" 
            alt="mycash+" 
            className="h-8"
          />
        </div>

        {/* Card de Login */}
        <div className="bg-[var(--color-surface)] rounded-2xl shadow-lg p-8">
          {/* Título */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
              {isSignUp ? 'Criar Conta' : 'Bem-vindo'}
            </h1>
            <p className="text-[var(--color-text-secondary)]">
              {isSignUp 
                ? 'Crie sua conta para começar a gerenciar suas finanças' 
                : 'Entre para acessar seu dashboard financeiro'}
            </p>
          </div>

          {/* Aviso se Supabase não estiver configurado */}
          {!isSupabaseConfigured && (
            <div className="mb-6 p-4 bg-[var(--yellow-50)] border border-[var(--yellow-200)] rounded-lg">
              <p className="text-sm text-[var(--yellow-800)] font-semibold mb-2">
                ⚠️ Supabase não configurado
              </p>
              <p className="text-xs text-[var(--yellow-700)]">
                Para usar a autenticação, configure as variáveis de ambiente no arquivo <code className="bg-[var(--yellow-100)] px-1 rounded">.env.local</code>:
              </p>
              <pre className="mt-2 text-xs bg-[var(--yellow-100)] p-2 rounded overflow-x-auto">
                {`VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...`}
              </pre>
            </div>
          )}

          {/* Erro */}
          {error && (
            <div className="mb-6 p-4 bg-[var(--red-50)] border border-[var(--red-200)] rounded-lg">
              <p className="text-sm text-[var(--red-700)]">{error}</p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nome (apenas no signup) */}
            {isSignUp && (
              <div>
                <label 
                  htmlFor="name" 
                  className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
                >
                  Nome completo
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: João Silva"
                  className="w-full h-14 px-4 bg-[var(--gray-100)] border border-[var(--gray-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full h-14 px-4 bg-[var(--gray-100)] border border-[var(--gray-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
              />
            </div>

            {/* Senha */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full h-14 px-4 bg-[var(--gray-100)] border border-[var(--gray-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
              />
              {isSignUp && (
                <p className="mt-2 text-xs text-[var(--color-text-tertiary)]">
                  Mínimo de 6 caracteres
                </p>
              )}
            </div>

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={loading || !isSupabaseConfigured}
              className="w-full h-14 bg-[var(--color-secondary)] text-[var(--color-text-inverse)] font-semibold rounded-xl hover:bg-[var(--color-secondary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Carregando...' : (isSignUp ? 'Criar Conta' : 'Entrar')}
            </button>
          </form>

          {/* Toggle Sign Up / Sign In */}
          <div className="mt-6 pt-6 border-t border-[var(--gray-200)] text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError(null)
              }}
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              {isSignUp ? (
                <>
                  Já tem uma conta? <span className="font-semibold text-[var(--color-primary)]">Entrar</span>
                </>
              ) : (
                <>
                  Não tem uma conta? <span className="font-semibold text-[var(--color-primary)]">Criar conta</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-[var(--color-text-tertiary)]">
          © 2024 mycash+. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}