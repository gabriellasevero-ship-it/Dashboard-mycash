import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

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
  userName,
  userEmail,
  userAvatar,
}: SidebarFooterProps) {
  const navigate = useNavigate()
  const { signOut, user } = useAuth()

  // Usar dados do usuário autenticado ou props como fallback
  const displayName = userName || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário'
  const displayEmail = userEmail || user?.email || ''

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

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
                alt={displayName}
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
                {displayName.charAt(0).toUpperCase()}
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
              {displayName}
            </p>
            {displayEmail && (
              <p 
                className="truncate"
                style={{
                  fontSize: '14px', /* Valor exato do Figma para email */
                  fontWeight: 'var(--font-weight-normal)', /* 400 do Figma */
                  color: 'var(--color-text-primary)', /* #080B12 do Figma */
                  lineHeight: '20px', /* Valor exato do Figma */
                }}
              >
                {displayEmail}
              </p>
            )}
          </div>

          {/* Botão de Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center flex-shrink-0 focus:outline-none"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'transparent',
              color: 'var(--red-500)',
              cursor: 'pointer',
              transition: 'var(--transition-color)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--red-50)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
            aria-label="Sair"
            title="Sair"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              style={{
                width: '20px',
                height: '20px',
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
          </button>
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
                alt={displayName}
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
                {displayName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
