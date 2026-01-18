import { useMemo } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { formatCurrency } from '@/utils/formatters'

/**
 * UpcomingExpensesWidget - Widget de próximas despesas
 * Lista despesas não pagas ordenadas por data de vencimento
 * 
 * Valores do Figma:
 * - Título: fontSize 18px, fontWeight 600/700
 * - Ícone carteira: 20px
 * - Botão "+": 40px diâmetro
 */
export function UpcomingExpensesWidget() {
  const { transactions, creditCards, bankAccounts, updateTransaction } = useFinance()

  // Buscar despesas não pagas e ordenar por data
  const upcomingExpenses = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense' && !t.isPaid)
      .sort((a, b) => {
        // Ordenar por data (mais próximo primeiro)
        return a.date.getTime() - b.date.getTime()
      })
      .slice(0, 5) // Limitar a 5 itens para exibição
  }, [transactions])

  // Função para obter nome da conta/cartão
  const getAccountName = (accountId: string | null): string => {
    if (!accountId) return 'Não especificado'

    // Procurar em cartões de crédito
    const creditCard = creditCards.find((card) => card.id === accountId)
    if (creditCard) {
      const lastDigits = creditCard.lastDigits || '****'
      return `Crédito ${creditCard.bank} **** ${lastDigits}`
    }

    // Procurar em contas bancárias
    const bankAccount = bankAccounts.find((account) => account.id === accountId)
    if (bankAccount) {
      return `${bankAccount.bank} conta`
    }

    return 'Não encontrado'
  }

  // Formatar data de vencimento - formato "Vence dia 21/01" (com mês com zero à esquerda)
  const formatDueDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    return `Vence dia ${day}/${month}`
  }

  // Marcar despesa como paga
  const handleMarkAsPaid = (transactionId: string) => {
    updateTransaction(transactionId, { isPaid: true })
  }

  const handleAddExpense = () => {
    // TODO: Abrir modal de adicionar transação (PROMPT 13)
    console.log('Abrir modal de adicionar despesa')
  }

  return (
    <div
      style={{
        borderRadius: '20px', /* Bordas arredondadas do Figma */
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB', /* Borda clara */
        padding: '24px', /* Padding confortável */
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{
          marginBottom: '20px',
        }}
      >
        {/* Título com ícone */}
        <div className="flex items-center gap-2" style={{ gap: '8px' }}>
          {/* Ícone de carteira */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            style={{
              width: '20px', /* Tamanho exato do Figma */
              height: '20px',
              color: '#080B12',
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m8.5 3.75H3.75a2.25 2.25 0 01-2.25-2.25V6a2.25 2.25 0 012.25-2.25h8.75m-8.75 0V9m8.75-3.75V9m0 12.75H9m0-12.75H9M12 6.75h9"
            />
          </svg>
          <h3
            style={{
              fontSize: '18px', /* Font size do Figma */
              fontWeight: '700', /* Bold do Figma */
              color: '#080B12',
            }}
          >
            Próximas despesas
          </h3>
        </div>

        {/* Botão "+" */}
        <button
          onClick={handleAddExpense}
          className="flex items-center justify-center"
          style={{
            width: '40px', /* Diâmetro exato do Figma */
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB', /* Borda clara */
            color: '#080B12',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F5F6F8' /* Cinza claro no hover */
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF'
          }}
          aria-label="Adicionar despesa"
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>

      {/* Lista de despesas */}
      {upcomingExpenses.length === 0 ? (
        <div
          style={{
            padding: 'var(--spacing-lg)',
            textAlign: 'center',
            color: '#525252',
            fontSize: '14px',
          }}
        >
          Nenhuma despesa pendente
        </div>
      ) : (
        <div className="flex flex-col">
          {upcomingExpenses.map((expense, index) => (
            <div key={expense.id}>
              {/* Item da despesa */}
              <div
                className="flex items-center justify-between"
                style={{
                  paddingTop: '16px',
                  paddingBottom: '16px',
                }}
              >
                {/* Coluna esquerda: Informações */}
                <div className="flex-1 min-w-0">
                  {/* Título/Descrição - valores exatos do Figma */}
                  <div
                    style={{
                      fontSize: '20px', /* Font size exato do Figma */
                      fontWeight: '700', /* Bold do Figma */
                      lineHeight: '28px', /* Line height exato do Figma */
                      color: '#080B12',
                      marginBottom: '4px',
                    }}
                  >
                    {expense.description}
                  </div>

                  {/* Data de vencimento - valores exatos do Figma */}
                  <div
                    style={{
                      fontSize: '12px', /* Font size exato do Figma */
                      fontWeight: '600', /* Semibold do Figma */
                      lineHeight: '16px', /* Line height exato do Figma */
                      color: '#080B12', /* Preto (não cinza) conforme Figma */
                      marginBottom: '4px',
                      letterSpacing: '0.3px', /* Letter spacing do Figma */
                    }}
                  >
                    {formatDueDate(expense.date)}
                  </div>

                  {/* Conta/Cartão */}
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#080B12', /* Preto conforme Figma */
                    }}
                  >
                    {getAccountName(expense.accountId)}
                  </div>
                </div>

                {/* Coluna direita: Valor + Checkmark */}
                <div className="flex items-center gap-3" style={{ gap: '12px' }}>
                  {/* Valor */}
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#080B12',
                    }}
                  >
                    {formatCurrency(expense.amount)}
                  </div>

                  {/* Checkmark - botão para marcar como paga */}
                  <button
                    onClick={() => handleMarkAsPaid(expense.id)}
                    className="flex items-center justify-center"
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#D1FAE5', /* Verde claro */
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#A7F3D0' /* Verde mais escuro no hover */
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#D1FAE5'
                    }}
                    aria-label="Marcar como paga"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                      stroke="#10B981" /* Verde escuro */
                      style={{
                        width: '14px',
                        height: '14px',
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Linha divisória (exceto no último item) */}
              {index < upcomingExpenses.length - 1 && (
                <div
                  style={{
                    height: '1px',
                    backgroundColor: '#E5E7EB', /* Linha fina cinza clara */
                    width: '100%',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
