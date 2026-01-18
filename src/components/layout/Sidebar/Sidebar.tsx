import { useSidebarState } from '@/hooks/useSidebarState'
import { SidebarHeader } from './SidebarHeader'
import { SidebarItem } from './SidebarItem'
import { SidebarFooter } from './SidebarFooter'

// Ícones SVG inline (substituir por biblioteca de ícones quando necessário)
const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-full h-full"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
    />
  </svg>
)

const CardsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-full h-full"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
    />
  </svg>
)

const TransactionsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-full h-full"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
)

const ProfileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-full h-full"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  </svg>
)

/**
 * Componente Sidebar - Navegação desktop
 * Seguindo Figma MCP como fonte da verdade
 * Renderiza apenas em desktop (≥1280px)
 * Possui estados expanded e collapsed com animações suaves
 * Usa exclusivamente tokens do design system
 */
export function Sidebar() {
  const { isExpanded, toggle } = useSidebarState()

  // Larguras baseadas no Figma: expanded ~240px, collapsed 64px
  const sidebarWidth = isExpanded ? '240px' : '64px'

  return (
    <>
      {/* Sidebar - apenas desktop */}
      <aside
        className="hidden lg:flex flex-col fixed left-0 top-0"
        style={{
          height: '100vh',
          width: sidebarWidth,
          backgroundColor: 'var(--color-surface)',
          borderRight: `1px solid var(--color-border)`,
          transition: 'var(--transition-slow)',
          zIndex: 'var(--z-fixed)',
        }}
      >
        {/* Header com logo */}
        <SidebarHeader isExpanded={isExpanded} />

        {/* Botão toggle - posicionado na borda direita */}
        <button
          onClick={toggle}
          className="absolute flex items-center justify-center"
          style={{
            right: '-12px',
            top: '80px',
            width: '24px',
            height: '24px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-surface)',
            border: `1px solid var(--color-border)`,
            boxShadow: 'var(--shadow-button)',
            transition: 'var(--transition-color)',
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-surface)'
          }}
          aria-label={isExpanded ? 'Colapsar sidebar' : 'Expandir sidebar'}
        >
          {isExpanded ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              style={{
                width: '16px',
                height: '16px',
                color: 'var(--color-text-secondary)',
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              style={{
                width: '16px',
                height: '16px',
                color: 'var(--color-text-secondary)',
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          )}
        </button>

        {/* Navegação */}
        <nav 
          className="flex-1 overflow-y-auto"
          style={{
            paddingLeft: '0', /* Padding já aplicado no header e footer */
            paddingRight: '0',
            paddingTop: '0',
            paddingBottom: '0',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-sidebar-item)', /* 26px itemSpacing do Figma */
          }}
        >
          <SidebarItem
            to="/"
            icon={<HomeIcon />}
            label="Home"
            isExpanded={isExpanded}
          />
          <SidebarItem
            to="/cards"
            icon={<CardsIcon />}
            label="Cartões"
            isExpanded={isExpanded}
          />
          <SidebarItem
            to="/transactions"
            icon={<TransactionsIcon />}
            label="Transações"
            isExpanded={isExpanded}
          />
          <SidebarItem
            to="/profile"
            icon={<ProfileIcon />}
            label="Perfil"
            isExpanded={isExpanded}
          />
        </nav>

        {/* Footer com perfil */}
        <SidebarFooter isExpanded={isExpanded} />
      </aside>
    </>
  )
}
