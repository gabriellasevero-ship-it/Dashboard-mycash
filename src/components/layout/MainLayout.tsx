import { ReactNode } from 'react'
import { Sidebar } from './Sidebar/Sidebar'
import { HeaderMobile } from './HeaderMobile/HeaderMobile'

interface MainLayoutProps {
  children: ReactNode
}

/**
 * MainLayout - Wrapper principal que orquestra Sidebar e HeaderMobile
 * 
 * Regras críticas:
 * - Desktop (≥1280px): apenas Sidebar aparece
 * - Mobile/Tablet (<1280px): apenas HeaderMobile aparece
 * - NUNCA renderizam simultaneamente
 * 
 * Breakpoint controlado via classes Tailwind:
 * - Sidebar: hidden lg:flex (esconde em <1280px, mostra em ≥1280px)
 * - HeaderMobile: lg:hidden (mostra em <1280px, esconde em ≥1280px)
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-bg flex flex-col">
      {/* HeaderMobile - renderiza apenas em mobile/tablet (<1280px) */}
      <HeaderMobile />

      {/* Sidebar - renderiza apenas em desktop (≥1280px) */}
      <Sidebar />

      {/* Conteúdo principal - ajusta margem baseado no estado da sidebar */}
      <main className="flex-1 w-full min-w-0">
        {children}
      </main>
    </div>
  )
}
