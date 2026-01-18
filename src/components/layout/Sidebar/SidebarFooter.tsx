interface SidebarFooterProps {
  isExpanded: boolean
  userName?: string
  userEmail?: string
  userAvatar?: string
}

/**
 * Componente Footer da Sidebar
 * Seguindo Figma MCP como fonte da verdade
 * Usa exclusivamente tokens do design system
 */
export function SidebarFooter({
  isExpanded,
  userName = 'Lucas Marte',
  userEmail = 'lucasmarte@gmail.com',
  userAvatar,
}: SidebarFooterProps) {
  return (
    <div 
      className="mt-auto"
      style={{
        paddingLeft: 'var(--spacing-md)',
        paddingRight: 'var(--spacing-md)',
        paddingTop: 'var(--spacing-lg)',
        paddingBottom: 'var(--spacing-lg)',
        borderTop: `1px solid var(--color-border)`,
      }}
    >
      {isExpanded ? (
        <div 
          className="flex items-center flex-shrink-0"
          style={{
            gap: 'var(--spacing-md)',
          }}
        >
          {/* Avatar */}
          <div 
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--gray-300)',
            }}
          >
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="object-cover"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 'var(--radius-full)',
                }}
              />
            ) : (
              <span 
                className="font-semibold"
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-primary)',
                  lineHeight: 'var(--line-height-tight)',
                }}
              >
                {userName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Informações do usuário */}
          <div 
            className="flex-1 min-w-0"
            style={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <p 
              className="truncate"
              style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-text-primary)',
                lineHeight: 'var(--line-height-normal)',
              }}
            >
              {userName}
            </p>
            <p 
              className="truncate"
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-secondary)',
                lineHeight: 'var(--line-height-normal)',
              }}
            >
              {userEmail}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          {/* Apenas avatar quando collapsed */}
          <div 
            className="flex items-center justify-center"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--gray-300)',
            }}
          >
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="object-cover"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 'var(--radius-full)',
                }}
              />
            ) : (
              <span 
                className="font-semibold"
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-primary)',
                  lineHeight: 'var(--line-height-tight)',
                }}
              >
                {userName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
