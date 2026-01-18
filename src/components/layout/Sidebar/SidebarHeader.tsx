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
        paddingLeft: isExpanded ? '32px' : '0', /* 32px quando expandido, centralizado quando colapsado */
        paddingRight: isExpanded ? '32px' : '0',
        paddingTop: isExpanded ? '32px' : '32px', /* Mantém padding vertical em ambos estados */
        paddingBottom: isExpanded ? '32px' : '32px',
        justifyContent: isExpanded ? 'flex-start' : 'center', /* Centraliza quando colapsado */
      }}
    >
      {isExpanded ? (
        <img
          src="/logo-mycash.svg"
          alt="mycash+"
          style={{
            height: '30px', /* Altura exata do SVG do Figma */
            width: 'auto',
            objectFit: 'contain',
          }}
        />
      ) : (
        <img
          src="/logo-mycash-collapsed.svg"
          alt="mycash+"
          style={{
            width: '45px', /* Largura exata do SVG do Figma (45x43) */
            height: '43px', /* Altura exata do SVG do Figma */
            objectFit: 'contain',
          }}
        />
      )}
    </div>
  )
}
