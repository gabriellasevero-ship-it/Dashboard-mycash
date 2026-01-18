import { useState } from 'react'
import { MenuDropdown } from './MenuDropdown'

/**
 * Componente HeaderMobile
 * Renderiza apenas em mobile/tablet (<1280px)
 * Substitui completamente a Sidebar em viewports menores
 * Fixo no topo, ocupa largura total, permanece visível durante scroll
 * 
 * Contém:
 * - Logo "mycash+" à esquerda
 * - Avatar do usuário à direita (clicável, abre MenuDropdown)
 * 
 * Seguindo Figma MCP como fonte da verdade
 * Usa exclusivamente tokens do design system
 */
export function HeaderMobile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="header-mobile-wrapper lg:hidden">
      {/* Header fixo no topo */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
        style={{
          height: '64px', /* Altura padrão para header mobile */
          backgroundColor: 'var(--color-surface)',
          borderBottom: `1px solid var(--color-border)`,
          paddingLeft: 'var(--spacing-md)', /* 16px */
          paddingRight: 'var(--spacing-md)',
        }}
      >
        {/* Logo à esquerda */}
        <img
          src="/logo-mycash.svg"
          alt="mycash+"
          style={{
            height: '24px', /* Tamanho apropriado para mobile */
            width: 'auto',
            objectFit: 'contain',
          }}
        />

        {/* Avatar à direita - clicável */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className="flex items-center justify-center flex-shrink-0 focus:outline-none"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: '#D9D9D9', /* avatar-fill-0 do Figma */
            cursor: 'pointer',
            transition: 'var(--transition-color)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.8'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1'
          }}
          aria-label="Abrir menu de navegação"
          aria-expanded={isMenuOpen}
        >
          <span
            className="font-semibold"
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-primary)',
              lineHeight: 'var(--line-height-tight)',
            }}
          >
            LM
          </span>
        </button>
      </header>

      {/* MenuDropdown - aparece quando avatar é clicado */}
      {isMenuOpen && (
        <MenuDropdown
          onClose={() => setIsMenuOpen(false)}
        />
      )}

      {/* Espaçador para empurrar conteúdo abaixo do header fixo */}
      <div
        style={{
          height: '64px',
        }}
      />
    </div>
  )
}
