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

/**
 * Converte string de input de moeda para número
 * Remove R$, pontos, substitui vírgula por ponto
 * Ex: "R$ 1.234,56" -> 1234.56
 */
export function parseCurrencyInput(value: string): number {
  if (!value) return 0
  
  // Remove R$, espaços e pontos (separadores de milhar)
  const cleaned = value
    .replace(/R\$\s*/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '.')
    .trim()
  
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Formata valor para exibição em input de moeda
 * Ex: 1234.56 -> "1.234,56"
 */
export function formatCurrencyInput(value: number): string {
  if (value === 0) return ''
  
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Formata data como DD/MM/AAAA
 */
export function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

/**
 * Parse data de DD/MM/AAAA para Date
 */
export function parseDate(dateString: string): Date | null {
  const parts = dateString.split('/')
  if (parts.length !== 3) return null
  
  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10) - 1
  const year = parseInt(parts[2], 10)
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null
  
  const date = new Date(year, month, day)
  if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
    return null
  }
  
  return date
}
