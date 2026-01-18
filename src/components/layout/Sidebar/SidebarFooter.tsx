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
        paddingLeft: '32px', /* Valor exato do Figma (paddingLeft do Sidebar aberto) */
        paddingRight: '32px', /* Valor exato do Figma (paddingRight do Sidebar aberto) */
        paddingTop: '32px', /* Valor exato do Figma (paddingTop do Sidebar aberto) */
        paddingBottom: '32px', /* Valor exato do Figma (paddingBottom do Sidebar aberto) */
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
              backgroundColor: '#D9D9D9', /* Valor exato do Figma (avatar-fill-0) */
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
                fontSize: '16px', /* Valor exato do Figma para nome do usuário */
                fontWeight: 'var(--font-weight-semibold)', /* 600 do Figma */
                color: 'var(--color-text-primary)', /* #080B12 do Figma */
                lineHeight: '20px', /* Valor exato do Figma */
              }}
            >
              {userName}
            </p>
            <p 
              className="truncate"
              style={{
                fontSize: '14px', /* Valor exato do Figma para email */
                fontWeight: 'var(--font-weight-normal)', /* 400 do Figma */
                color: 'var(--color-text-primary)', /* #080B12 do Figma */
                lineHeight: '20px', /* Valor exato do Figma */
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
              backgroundColor: '#D9D9D9', /* Valor exato do Figma (avatar-fill-0) */
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
