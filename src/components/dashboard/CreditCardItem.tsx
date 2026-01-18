import { CreditCard, CreditCardTheme } from '@/types'
import { formatCurrency } from '@/utils/formatters'

interface CreditCardItemProps {
  card: CreditCard
  onClick?: () => void
}

/**
 * CreditCardItem - Item individual de cartão dentro do widget
 * Estrutura: ícone à esquerda, informações ao centro, badge de uso à direita
 */
export function CreditCardItem({ card, onClick }: CreditCardItemProps) {
  // Calcular percentual de uso
  const usagePercentage = card.limit > 0 
    ? Math.round((card.currentBill / card.limit) * 100)
    : 0

  // Cores e estilos por tema
  const getThemeStyles = (theme: CreditCardTheme) => {
    switch (theme) {
      case 'black':
        return {
          backgroundColor: '#080B12', /* Preto */
          iconColor: '#FFFFFF', /* Branco para contraste */
          badgeColor: '#FFFFFF', /* Badge branco */
          badgeTextColor: '#080B12', /* Texto preto no badge */
        }
      case 'lime':
        return {
          backgroundColor: '#D7FF00', /* Verde-limão */
          iconColor: '#080B12', /* Preto para contraste */
          badgeColor: '#080B12', /* Badge preto */
          badgeTextColor: '#FFFFFF', /* Texto branco no badge */
        }
      case 'white':
        return {
          backgroundColor: '#FFFFFF', /* Branco */
          iconColor: '#080B12', /* Preto para contraste */
          border: '1px solid #E5E7EB', /* Borda para destacar */
          badgeColor: '#080B12', /* Badge preto */
          badgeTextColor: '#FFFFFF', /* Texto branco no badge */
        }
    }
  }

  const themeStyles = getThemeStyles(card.theme)

  // Formatar último dígitos do cartão
  const formatLastDigits = (digits?: string) => {
    if (!digits) return '•••• ••••'
    return `•••• ${digits}`
  }

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 w-full cursor-pointer"
      style={{
        padding: '16px',
        borderRadius: '12px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Ícone à esquerda - bloco visual com tema */}
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '8px',
          backgroundColor: themeStyles.backgroundColor,
          border: themeStyles.border || 'none',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke={themeStyles.iconColor}
          style={{
            width: '24px',
            height: '24px',
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
          />
        </svg>
      </div>

      {/* Informações ao centro */}
      <div className="flex-1 min-w-0">
        {/* Nome do banco/cartão */}
        <div
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#525252', /* Cinza médio */
            marginBottom: '4px',
          }}
        >
          {card.bank}
        </div>

        {/* Valor da fatura atual */}
        <div
          style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#080B12',
            marginBottom: '4px',
          }}
        >
          {formatCurrency(card.currentBill)}
        </div>

        {/* Últimos dígitos mascarados */}
        <div
          style={{
            fontSize: '12px',
            color: '#A3A3A3', /* Cinza suave */
          }}
        >
          {formatLastDigits(card.lastDigits)}
        </div>
      </div>

      {/* Badge de percentual de uso à direita */}
      <div
        className="flex-shrink-0 flex items-center justify-center"
        style={{
          minWidth: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: themeStyles.badgeColor,
          color: themeStyles.badgeTextColor,
          fontSize: '14px',
          fontWeight: '700',
        }}
      >
        {usagePercentage}%
      </div>
    </div>
  )
}
