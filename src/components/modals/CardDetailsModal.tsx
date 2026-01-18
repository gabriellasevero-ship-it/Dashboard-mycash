import { useMemo } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { Modal } from '@/components/ui/Modal'
import { CreditCard } from '@/types'
import { formatCurrency } from '@/utils/formatters'
import { NewTransactionModal } from './NewTransactionModal'
import { useState } from 'react'

interface CardDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  card: CreditCard | null
}

/**
 * CardDetailsModal - Modal de detalhes do cartão
 */
export function CardDetailsModal({ isOpen, onClose, card }: CardDetailsModalProps) {
  const { transactions } = useFinance()
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false)

  // Filtrar transações do cartão
  const cardTransactions = useMemo(() => {
    if (!card) return []
    return transactions
      .filter((t) => t.type === 'expense' && t.accountId === card.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [card, transactions])

  // Calcular percentual de uso
  const usagePercentage = useMemo(() => {
    if (!card || card.limit === 0) return 0
    return (card.currentBill / card.limit) * 100
  }, [card])

  // Limite disponível
  const availableLimit = useMemo(() => {
    if (!card) return 0
    return card.limit - card.currentBill
  }, [card])

  if (!card) return null

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div
          style={{
            width: '100%',
            maxWidth: '900px',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between flex-shrink-0"
            style={{
              padding: '24px 32px',
              borderBottom: '1px solid #E5E7EB',
            }}
          >
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#080B12',
              }}
            >
              {card.name}
            </h2>
            <button
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#F5F6F8',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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
                  color: '#080B12',
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

          {/* Conteúdo Scrollável */}
          <div
            className="flex-1 overflow-y-auto"
            style={{
              padding: '32px',
            }}
          >
            {/* Informações do Cartão */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: '#F5F6F8',
                }}
              >
                <p
                  style={{
                    fontSize: '12px',
                    color: '#525252',
                    marginBottom: '4px',
                  }}
                >
                  Limite total
                </p>
                <p
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#080B12',
                  }}
                >
                  {formatCurrency(card.limit)}
                </p>
              </div>

              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: '#F5F6F8',
                }}
              >
                <p
                  style={{
                    fontSize: '12px',
                    color: '#525252',
                    marginBottom: '4px',
                  }}
                >
                  Fatura atual
                </p>
                <p
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: usagePercentage > 80 ? '#EF4444' : '#080B12',
                  }}
                >
                  {formatCurrency(card.currentBill)}
                </p>
              </div>

              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: '#F5F6F8',
                }}
              >
                <p
                  style={{
                    fontSize: '12px',
                    color: '#525252',
                    marginBottom: '4px',
                  }}
                >
                  Limite disponível
                </p>
                <p
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#080B12',
                  }}
                >
                  {formatCurrency(availableLimit)}
                </p>
              </div>
            </div>

            {/* Percentual de uso - Barra de progresso */}
            <div style={{ marginBottom: '24px' }}>
              <div className="flex items-center justify-between mb-2">
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#080B12',
                  }}
                >
                  Uso do limite
                </p>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#525252',
                  }}
                >
                  {usagePercentage.toFixed(1)}%
                </p>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '12px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: '#E5E7EB',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${Math.min(usagePercentage, 100)}%`,
                    height: '100%',
                    backgroundColor: usagePercentage > 80 ? '#EF4444' : '#D7FF00',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>

            {/* Informações adicionais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: '#F5F6F8',
                }}
              >
                <p
                  style={{
                    fontSize: '12px',
                    color: '#525252',
                    marginBottom: '4px',
                  }}
                >
                  Fechamento
                </p>
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#080B12',
                  }}
                >
                  Dia {card.closingDay}
                </p>
              </div>

              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: '#F5F6F8',
                }}
              >
                <p
                  style={{
                    fontSize: '12px',
                    color: '#525252',
                    marginBottom: '4px',
                  }}
                >
                  Vencimento
                </p>
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#080B12',
                  }}
                >
                  Dia {card.dueDay}
                </p>
              </div>

              {card.lastDigits && (
                <div
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: '#F5F6F8',
                  }}
                >
                  <p
                    style={{
                      fontSize: '12px',
                      color: '#525252',
                      marginBottom: '4px',
                    }}
                  >
                    Número final
                  </p>
                  <p
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#080B12',
                      fontFamily: 'monospace',
                    }}
                  >
                    •••• {card.lastDigits}
                  </p>
                </div>
              )}
            </div>

            {/* Tabela de Despesas */}
            <div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#080B12',
                  marginBottom: '16px',
                }}
              >
                Despesas vinculadas
              </h3>

              {cardTransactions.length === 0 ? (
                <p
                  style={{
                    padding: '32px',
                    textAlign: 'center',
                    color: '#525252',
                    fontSize: '14px',
                  }}
                >
                  Nenhuma despesa registrada neste cartão ainda.
                </p>
              ) : (
                <div
                  style={{
                    border: '1px solid #E5E7EB',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                  }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F5F6F8' }}>
                        <th
                          style={{
                            padding: '12px 16px',
                            textAlign: 'left',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#525252',
                            textTransform: 'uppercase',
                          }}
                        >
                          Data
                        </th>
                        <th
                          style={{
                            padding: '12px 16px',
                            textAlign: 'left',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#525252',
                            textTransform: 'uppercase',
                          }}
                        >
                          Descrição
                        </th>
                        <th
                          style={{
                            padding: '12px 16px',
                            textAlign: 'left',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#525252',
                            textTransform: 'uppercase',
                          }}
                        >
                          Categoria
                        </th>
                        <th
                          style={{
                            padding: '12px 16px',
                            textAlign: 'left',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#525252',
                            textTransform: 'uppercase',
                          }}
                        >
                          Parcelas
                        </th>
                        <th
                          style={{
                            padding: '12px 16px',
                            textAlign: 'right',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#525252',
                            textTransform: 'uppercase',
                          }}
                        >
                          Valor
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cardTransactions.slice(0, 10).map((transaction, index) => (
                        <tr
                          key={transaction.id}
                          style={{
                            backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
                            borderTop: '1px solid #E5E7EB',
                          }}
                        >
                          <td
                            style={{
                              padding: '12px 16px',
                              fontSize: '14px',
                              color: '#080B12',
                            }}
                          >
                            {new Date(transaction.date).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })}
                          </td>
                          <td
                            style={{
                              padding: '12px 16px',
                              fontSize: '14px',
                              color: '#080B12',
                            }}
                          >
                            {transaction.description}
                          </td>
                          <td
                            style={{
                              padding: '12px 16px',
                              fontSize: '14px',
                              color: '#525252',
                            }}
                          >
                            {transaction.category}
                          </td>
                          <td
                            style={{
                              padding: '12px 16px',
                              fontSize: '14px',
                              color: '#525252',
                            }}
                          >
                            {transaction.installments || 1}x
                          </td>
                          <td
                            style={{
                              padding: '12px 16px',
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#080B12',
                              textAlign: 'right',
                            }}
                          >
                            {formatCurrency(transaction.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Footer com Ações */}
          <div
            className="flex items-center justify-between flex-shrink-0"
            style={{
              padding: '24px 32px',
              borderTop: '1px solid #E5E7EB',
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: '12px 24px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid #E5E7EB',
                backgroundColor: 'transparent',
                color: '#080B12',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Fechar
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => setIsNewTransactionModalOpen(true)}
                style={{
                  padding: '12px 24px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: '#080B12',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Adicionar Despesa
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal de Nova Transação pré-preenchido */}
      <NewTransactionModal
        isOpen={isNewTransactionModalOpen}
        onClose={() => setIsNewTransactionModalOpen(false)}
        preselectedAccountId={card.id}
      />
    </>
  )
}
