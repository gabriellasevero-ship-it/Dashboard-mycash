import { ReactNode } from 'react'
import { Sidebar } from './Sidebar/Sidebar'
import { HeaderMobile } from './HeaderMobile/HeaderMobile'
import { useSidebarState } from '@/hooks/useSidebarState'

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
  const { isExpanded } = useSidebarState()
  
  // Larguras baseadas no Figma: expanded ~240px, collapsed 64px
  const sidebarWidth = isExpanded ? '240px' : '64px'

  return (
    <div className="min-h-screen w-full bg-bg flex">
      {/* HeaderMobile - renderiza apenas em mobile/tablet (<1280px) */}
      <HeaderMobile />

      {/* Sidebar - renderiza apenas em desktop (≥1280px) */}
      <Sidebar />

      {/* Conteúdo principal - flex para permitir espaçador + conteúdo */}
      <main className="flex-1 flex min-w-0">
        {/* Espaçador para sidebar fixa no desktop - empurra conteúdo para direita */}
        <div
          className="hidden lg:block flex-shrink-0"
          style={{
            width: sidebarWidth,
            transition: 'width var(--transition-slow)',
          }}
        />
        {/* Conteúdo após o espaçador */}
        <div className="flex-1 w-full min-w-0">
          {children}
        </div>
      </main>
    </div>
  )
}
