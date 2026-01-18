import { ReactNode } from 'react'
import { Sidebar } from './Sidebar/Sidebar'

interface MainLayoutProps {
  children: ReactNode
}

/**
 * MainLayout - Wrapper principal que orquestra Sidebar e conteúdo
 * Garante que Sidebar apenas renderiza em desktop (≥1280px)
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-bg flex">
      {/* Sidebar - renderiza apenas em desktop via classes Tailwind */}
      <Sidebar />

      {/* Conteúdo principal - ajusta margem baseado no estado da sidebar */}
      <main className="flex-1 w-full min-w-0">
        {children}
      </main>
    </div>
  )
}
