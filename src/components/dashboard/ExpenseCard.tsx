import { useFinance } from '@/contexts/FinanceContext'
import { useCountAnimation } from '@/hooks/useCountAnimation'
import { formatCurrency } from '@/utils/formatters'

/**
 * ExpenseCard - Card de Despesas
 * Fundo branco com borda sutil
 * Similar ao IncomeCard mas com diferenças visuais (cinza médio, ícone vermelho)
 */
export function ExpenseCard() {
  const { calculateExpensesForPeriod } = useFinance()

  // Valor atual das despesas
  const expenses = calculateExpensesForPeriod()

  // Animação de contagem
  const animatedValue = useCountAnimation(expenses)

  return (
    <div
      className="relative"
      style={{
        borderRadius: '20px', /* Corner radius exato do Figma */
        backgroundColor: '#FFFFFF', /* Branco */
        border: `1px solid #E5E7EB`, /* Borda exata do Figma */
        padding: '24px', /* Padding exato do Figma */
        minHeight: '184px', /* Altura do card no Figma */
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Header: Label e Ícone */}
      <div
        className="flex items-center justify-between"
        style={{
          marginBottom: 'var(--spacing-md)',
        }}
      >
        {/* Label "Despesas" - valores exatos do Figma */}
        <div
          style={{
            fontSize: '18px', /* Font size exato do Figma */
            fontWeight: '700', /* Bold do Figma */
            color: '#080B12', /* Preto #080B12 do Figma */
            lineHeight: '28px', /* Line height do Figma */
          }}
        >
          Despesas
        </div>

        {/* Círculo com ícone de seta diagonal (saída de dinheiro) */}
        <div
          className="flex items-center justify-center"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--red-50)', /* Vermelho muito claro */
          }}
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
              color: 'var(--color-error)', /* Vermelho */
              transform: 'rotate(135deg)', /* Rotacionar para cima-direita */
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </div>
      </div>

      {/* Valor das despesas - valores exatos do Figma */}
      <div
        style={{
          fontSize: '28px', /* Font size exato do Figma */
          fontWeight: '700', /* Bold do Figma */
          color: '#080B12', /* Preto #080B12 do Figma */
          lineHeight: '36px', /* Line height exato do Figma */
        }}
      >
        {formatCurrency(animatedValue)}
      </div>
    </div>
  )
}
