import { Link, useLocation } from 'react-router-dom'
import { ReactNode } from 'react'

interface SidebarItemProps {
  to: string
  icon: ReactNode
  label: string
  isExpanded: boolean
}

/**
 * Componente Item de navegação da Sidebar
 * Seguindo Figma MCP como fonte da verdade
 * Item ativo: fundo verde-limão (primary), texto branco, ícone branco
 * Item inativo: fundo transparente, texto cinza
 * Usa exclusivamente tokens do design system
 */
export function SidebarItem({ to, icon, label, isExpanded }: SidebarItemProps) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      className="group relative flex items-center flex-shrink-0"
      style={{
        gap: 'var(--spacing-md)',
        paddingLeft: '32px', /* Padding do container do Figma */
        paddingRight: '32px', /* Padding do container do Figma */
        paddingTop: 'var(--spacing-sm)',
        paddingBottom: 'var(--spacing-sm)',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: isActive 
          ? 'var(--color-primary)' /* #D7FF00 do Figma */
          : 'transparent',
        color: isActive 
          ? 'var(--color-text-primary)' /* #080B12 (preto) do Figma */
          : 'var(--color-text-primary)', /* Texto preto mesmo quando inativo */
        transition: 'var(--transition-color)',
        justifyContent: !isExpanded ? 'center' : 'flex-start',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'
        }
        // Mostrar tooltip quando collapsed
        if (!isExpanded) {
          const tooltip = e.currentTarget.querySelector('[data-tooltip]') as HTMLElement
          if (tooltip) {
            setTimeout(() => {
              tooltip.style.opacity = '1'
              tooltip.style.visibility = 'visible'
            }, 300)
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent'
        }
        // Esconder tooltip quando collapsed
        if (!isExpanded) {
          const tooltip = e.currentTarget.querySelector('[data-tooltip]') as HTMLElement
          if (tooltip) {
            tooltip.style.opacity = '0'
            tooltip.style.visibility = 'hidden'
          }
        }
      }}
      title={!isExpanded ? label : undefined}
    >
      {/* Ícone */}
      <span
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: '20px',
          height: '20px',
          color: isActive 
            ? 'var(--color-text-inverse)' /* Ícone branco quando ativo (#FFFFFF) do Figma */
            : 'var(--color-text-primary)', /* Ícone preto quando inativo (#080B12) do Figma */
          transition: 'var(--transition-color)',
        }}
      >
        {icon}
      </span>

      {/* Label - apenas quando expanded */}
      {isExpanded && (
        <span 
          className="whitespace-nowrap"
          style={{
            fontSize: '18px', /* Valor exato do Figma para labels de navegação */
            fontWeight: 'var(--font-weight-semibold)', /* 600 do Figma */
            lineHeight: '24px', /* Valor exato do Figma */
          }}
        >
          {label}
        </span>
      )}

      {/* Tooltip quando collapsed */}
      {!isExpanded && (
        <div
          data-tooltip
          className="absolute pointer-events-none whitespace-nowrap"
          style={{
            left: '100%',
            marginLeft: 'var(--spacing-sm)',
            paddingLeft: 'var(--spacing-sm)',
            paddingRight: 'var(--spacing-sm)',
            paddingTop: 'var(--spacing-xs)',
            paddingBottom: 'var(--spacing-xs)',
            backgroundColor: 'var(--gray-900)',
            color: 'var(--color-text-inverse)',
            fontSize: 'var(--font-size-xs)',
            borderRadius: 'var(--radius-md)',
            opacity: 0,
            visibility: 'hidden',
            transition: 'opacity var(--transition-opacity), visibility var(--transition-opacity)',
            transitionDelay: '300ms',
            zIndex: 'var(--z-tooltip)',
          }}
        >
          {label}
        </div>
      )}
    </Link>
  )
}
