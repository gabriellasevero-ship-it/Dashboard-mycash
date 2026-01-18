import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { FinanceProvider } from './contexts/FinanceContext'
import { MainLayout } from './components/layout/MainLayout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Cards from './pages/Cards'
import Transactions from './pages/Transactions'
import Profile from './pages/Profile'
import Login from './pages/Login'
import { useAuth } from './hooks/useAuth'

/**
 * Componente para rotas públicas que redirecionam autenticados
 */
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[var(--color-bg)]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)]">Carregando...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <FinanceProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota pública - Login */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />

          {/* Rotas protegidas - Requerem autenticação */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cards"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Cards />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Transactions />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Profile />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Redirecionar rotas desconhecidas para login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </FinanceProvider>
  )
}

export default App
