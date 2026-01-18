/**
 * Funções utilitárias de formatação
 * Seguindo padrões brasileiros
 */

/**
 * Formata um número como moeda brasileira (R$ 1.234,56)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Calcula crescimento percentual entre dois valores
 * Retorna string formatada (ex: "+12%", "-5%")
 */
export function calculateGrowthPercentage(
  currentValue: number,
  previousValue: number
): string {
  if (previousValue === 0) {
    return currentValue > 0 ? '+100%' : '0%'
  }

  const percentage = ((currentValue - previousValue) / previousValue) * 100
  const sign = percentage >= 0 ? '+' : ''
  return `${sign}${Math.round(percentage)}%`
}
