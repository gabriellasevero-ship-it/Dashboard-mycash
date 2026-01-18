import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ReactNode, useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface MenuDropdownProps {
  onClose: () => void
}

/**
 * Componente MenuDropdown
 * Aparece quando o avatar do HeaderMobile é clicado
 * Desliza de cima para baixo com animação suave
 * Cobre o conteúdo abaixo sem ocupar a tela inteira (não é fullscreen)
 * 
 * Contém:
 * - Botão X no canto superior direito para fechar
 * - Lista de itens de navegação (ícone + texto)
 * - Item ativo destacado com fundo preto
 * - Botão vermelho "Sair" na parte inferior
 * 
 * Fecha ao:
 * - Clicar em qualquer item de navegação
 * - Clicar no botão X
 * - Clicar/tocar fora da área do menu (overlay escuro semi-transparente)
 * 
 * Seguindo Figma MCP como fonte da verdade
 * Usa exclusivamente tokens do design system
 */

// Ícones SVG inline (mesmos da Sidebar)
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

interface MenuItemProps {
  to: string
  icon: ReactNode
  label: string
  isActive: boolean
  onClick: () => void
}

function MenuItem({ to, icon, label, isActive, onClick }: MenuItemProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center w-full"
      style={{
        gap: 'var(--spacing-md)',
        paddingLeft: 'var(--spacing-lg)',
        paddingRight: 'var(--spacing-lg)',
        paddingTop: 'var(--spacing-md)',
        paddingBottom: 'var(--spacing-md)',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: isActive 
          ? 'var(--color-text-primary)' /* Fundo preto para item ativo */
          : 'transparent',
        color: isActive 
          ? 'var(--color-primary)' /* Texto verde-limão quando ativo */
          : 'var(--color-text-primary)', /* Texto preto quando inativo */
        transition: 'var(--transition-color)',
        textDecoration: 'none',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent'
        }
      }}
    >
      {/* Ícone */}
      <span
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: '20px',
          height: '20px',
          color: isActive 
            ? 'var(--color-primary)' /* Ícone verde-limão quando ativo */
            : 'var(--color-text-primary)', /* Ícone preto quando inativo */
          transition: 'var(--transition-color)',
        }}
      >
        {icon}
      </span>

      {/* Label */}
      <span
        className="whitespace-nowrap"
        style={{
          fontSize: '18px', /* Mesmo tamanho do Sidebar */
          fontWeight: 'var(--font-weight-semibold)', /* 600 do Figma */
          lineHeight: '24px',
        }}
      >
        {label}
      </span>
    </Link>
  )
}

export function MenuDropdown({ onClose }: MenuDropdownProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const menuRef = useRef<HTMLDivElement>(null)

  // Fechar ao clicar fora do menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    // Adicionar listener após um pequeno delay para não fechar imediatamente ao abrir
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  // Prevenir scroll do body quando menu aberto
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleItemClick = () => {
    onClose()
  }

  const handleLogout = async () => {
    try {
      await signOut()
      onClose()
      navigate('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  return (
    <>
      {/* Overlay escuro semi-transparente */}
      <div
        className="fixed inset-0 z-40"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)', /* Overlay escuro semi-transparente */
          animation: 'fadeIn 200ms ease-out',
        }}
        onClick={onClose}
      />

      {/* Menu dropdown - desliza de cima para baixo */}
      <div
        ref={menuRef}
        className="fixed top-0 left-0 right-0 z-50 lg:hidden"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderBottomLeftRadius: 'var(--radius-xl)',
          borderBottomRightRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          maxHeight: '80vh', /* Não ocupa tela inteira */
          overflowY: 'auto',
          animation: 'slideDown 300ms ease-out',
        }}
      >
        {/* Header do menu com botão X */}
        <div
          className="flex items-center justify-between"
          style={{
            paddingLeft: 'var(--spacing-lg)',
            paddingRight: 'var(--spacing-lg)',
            paddingTop: 'var(--spacing-lg)',
            paddingBottom: 'var(--spacing-md)',
          }}
        >
          <h2
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
            }}
          >
            Menu
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center focus:outline-none"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'transparent',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              transition: 'var(--transition-color)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
            aria-label="Fechar menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              style={{
                width: '20px',
                height: '20px',
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Lista de itens de navegação */}
        <nav
          className="flex flex-col"
          style={{
            paddingLeft: 'var(--spacing-md)',
            paddingRight: 'var(--spacing-md)',
            paddingBottom: 'var(--spacing-md)',
            gap: 'var(--spacing-sm)',
          }}
        >
          <MenuItem
            to="/"
            icon={<HomeIcon />}
            label="Home"
            isActive={location.pathname === '/'}
            onClick={handleItemClick}
          />
          <MenuItem
            to="/cards"
            icon={<CardsIcon />}
            label="Cartões"
            isActive={location.pathname === '/cards'}
            onClick={handleItemClick}
          />
          <MenuItem
            to="/transactions"
            icon={<TransactionsIcon />}
            label="Transações"
            isActive={location.pathname === '/transactions'}
            onClick={handleItemClick}
          />
          <MenuItem
            to="/profile"
            icon={<ProfileIcon />}
            label="Perfil"
            isActive={location.pathname === '/profile'}
            onClick={handleItemClick}
          />
        </nav>

        {/* Botão Sair na parte inferior */}
        <div
          className="border-t"
          style={{
            borderColor: 'var(--color-border)',
            paddingLeft: 'var(--spacing-md)',
            paddingRight: 'var(--spacing-md)',
            paddingTop: 'var(--spacing-md)',
            paddingBottom: 'var(--spacing-lg)',
          }}
        >
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center focus:outline-none"
            style={{
              paddingTop: 'var(--spacing-md)',
              paddingBottom: 'var(--spacing-md)',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#EF4444', /* Vermelho para botão Sair */
              color: 'var(--color-text-inverse)',
              fontSize: '18px',
              fontWeight: 'var(--font-weight-semibold)',
              lineHeight: '24px',
              cursor: 'pointer',
              transition: 'var(--transition-color)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#DC2626' /* Vermelho mais escuro no hover */
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#EF4444'
            }}
          >
            Sair
          </button>
        </div>
      </div>

    </>
  )
}
