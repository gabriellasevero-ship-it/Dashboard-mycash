import { useMemo } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { useCountAnimation } from '@/hooks/useCountAnimation'
import { formatCurrency, calculateGrowthPercentage } from '@/utils/formatters'

/**
 * BalanceCard - Card de Saldo Total
 * Fundo preto com círculo verde-limão desfocado decorativo
 * Mostra saldo total e crescimento percentual
 */
export function BalanceCard() {
  const { calculateTotalBalance } = useFinance()

  // Valor atual do saldo
  const currentBalance = calculateTotalBalance()

  // Calcular saldo de 30 dias atrás (simplificado - usar saldo atual como base)
  // TODO: Implementar cálculo real comparando com histórico
  const previousBalance = useMemo(() => {
    // Simulação: assumir 10% de crescimento para demonstração
    return currentBalance / 1.1
  }, [currentBalance])

  // Animação de contagem
  const animatedValue = useCountAnimation(currentBalance)

  // Calcular crescimento percentual
  const growthPercentage = useMemo(
    () => calculateGrowthPercentage(currentBalance, previousBalance),
    [currentBalance, previousBalance]
  )

  return (
    <div
      className="relative overflow-hidden"
      style={{
        borderRadius: '20px', /* Corner radius exato do Figma */
        backgroundColor: '#080B12', /* Preto #080B12 do Figma */
        padding: '24px', /* Padding exato do Figma */
        minHeight: '184px', /* Altura do card no Figma */
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Círculo decorativo verde-limão desfocado */}
      <div
        className="absolute"
        style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          backgroundColor: '#D7FF00', /* Verde-limão exato do Figma */
          opacity: 0.15, /* Opacidade baixa */
          filter: 'blur(60px)', /* Blur intenso */
          top: '-80px',
          right: '-80px',
        }}
      />

      {/* Label "Saldo Total" - valores exatos do Figma */}
      <div
        style={{
          fontSize: '18px', /* Font size exato do Figma */
          color: 'rgba(255, 255, 255, 0.7)', /* Texto branco semi-transparente para legibilidade em fundo preto */
          fontWeight: '400', /* Font weight do Figma */
          lineHeight: '28px', /* Line height exato do Figma */
          letterSpacing: '0.3px', /* Letter spacing do Figma */
          position: 'relative',
          zIndex: 1,
        }}
      >
        Saldo total
      </div>

      {/* Valor do saldo - valores exatos do Figma */}
      <div
        style={{
          fontSize: '28px', /* Font size exato do Figma */
          fontWeight: '700', /* Bold do Figma */
          color: '#FFFFFF', /* Branco */
          lineHeight: '36px', /* Line height exato do Figma */
          position: 'relative',
          zIndex: 1,
        }}
      >
        {formatCurrency(animatedValue)}
      </div>

      {/* Badge com crescimento percentual */}
      <div
        className="inline-flex items-center gap-1"
        style={{
          paddingLeft: 'var(--spacing-md)',
          paddingRight: 'var(--spacing-md)',
          paddingTop: 'var(--spacing-xs)',
          paddingBottom: 'var(--spacing-xs)',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'rgba(255, 255, 255, 0.2)', /* Branco semi-transparente */
          width: 'fit-content',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Ícone de gráfico crescente */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          style={{
            width: '16px',
            height: '16px',
            color: 'var(--color-text-inverse)',
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
          />
        </svg>
        <span
          style={{
            fontSize: 'var(--font-size-xs)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-inverse)',
          }}
        >
          {growthPercentage} esse mês
        </span>
      </div>
    </div>
  )
}
