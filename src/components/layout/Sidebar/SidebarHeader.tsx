interface SidebarHeaderProps {
  isExpanded: boolean
}

/**
 * Componente Header da Sidebar
 * Seguindo Figma MCP como fonte da verdade
 * Usa exclusivamente tokens do design system
 */
export function SidebarHeader({ isExpanded }: SidebarHeaderProps) {
  return (
    <div 
      className="flex items-center"
      style={{
        paddingLeft: 'var(--spacing-md)',
        paddingRight: 'var(--spacing-md)',
        paddingTop: 'var(--spacing-lg)',
        paddingBottom: 'var(--spacing-lg)',
      }}
    >
      {isExpanded ? (
        <img
          src="/logo-mycash.svg"
          alt="mycash+"
          style={{
            height: 'var(--spacing-3xl)',
            width: 'auto',
            objectFit: 'contain',
          }}
        />
      ) : (
        <div 
          className="flex items-center justify-center"
          style={{
            width: 'var(--spacing-3xl)',
            height: 'var(--spacing-3xl)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-primary)',
          }}
        >
          <span 
            className="font-bold"
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-inverse)',
              lineHeight: 'var(--line-height-tight)',
            }}
          >
            m+
          </span>
        </div>
      )}
    </div>
  )
}
