import { useState, useMemo } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { formatCurrency } from '@/utils/formatters'
import { CardDetailsModal } from '@/components/modals/CardDetailsModal'
import { AddCardModal } from '@/components/modals/AddCardModal'
import { NewTransactionModal } from '@/components/modals/NewTransactionModal'
import { CreditCard } from '@/types'

/**
 * CardsView - View completa de cartões de crédito
 * Grid responsivo com cards detalhados
 */
function Cards() {
  const { creditCards } = useFinance()
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null)
  const [isCardDetailsModalOpen, setIsCardDetailsModalOpen] = useState(false)
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false)
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false)
  const [preselectedCardId, setPreselectedCardId] = useState<string | null>(null)

  // Ordenar cartões por fatura decrescente
  const sortedCards = useMemo(() => {
    return [...creditCards].sort((a, b) => b.currentBill - a.currentBill)
  }, [creditCards])

  const handleCardClick = (card: CreditCard) => {
    setSelectedCard(card)
    setIsCardDetailsModalOpen(true)
  }

  const handleAddExpense = (cardId: string) => {
    setPreselectedCardId(cardId)
    setIsNewTransactionModalOpen(true)
  }

  return (
    <div className="min-h-screen w-full bg-bg">
      <div
        className="w-full mx-auto"
        style={{
          maxWidth: '1400px',
          paddingLeft: 'var(--spacing-page-desktop)',
          paddingRight: 'var(--spacing-page-desktop)',
          paddingTop: 'var(--spacing-xl)',
          paddingBottom: 'var(--spacing-xl)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between mb-8"
          style={{
            marginBottom: 'var(--spacing-xl)',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#080B12',
                marginBottom: '8px',
              }}
            >
              Cartões de Crédito
            </h1>
            <p
              style={{
                fontSize: '16px',
                color: '#525252',
              }}
            >
              Gerencia seus cartões e contas bancárias
            </p>
          </div>
          <button
            onClick={() => setIsAddCardModalOpen(true)}
            className="flex items-center gap-2"
            style={{
              padding: '12px 24px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#080B12',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1F2937'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#080B12'
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
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Novo Cartão
          </button>
        </div>

        {/* Grid de Cartões */}
        {sortedCards.length === 0 ? (
          <div
            style={{
              padding: '64px 32px',
              textAlign: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid #E5E7EB',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              style={{
                width: '64px',
                height: '64px',
                color: '#A3A3A3',
                margin: '0 auto 16px',
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
              />
            </svg>
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#080B12',
                marginBottom: '8px',
              }}
            >
              Nenhum cartão cadastrado
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: '#525252',
                marginBottom: '24px',
              }}
            >
              Comece adicionando seu primeiro cartão de crédito
            </p>
            <button
              onClick={() => setIsAddCardModalOpen(true)}
              style={{
                padding: '12px 24px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: '#080B12',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Cadastrar Primeiro Cartão
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCards.map((card) => {
              const usagePercentage = card.limit > 0 ? (card.currentBill / card.limit) * 100 : 0
              const availableLimit = card.limit - card.currentBill

              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-xl)',
                    border: `2px solid ${
                      card.theme === 'black'
                        ? '#080B12'
                        : card.theme === 'lime'
                        ? '#D7FF00'
                        : '#E5E7EB'
                    }`,
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {/* Header do Card */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#080B12',
                          marginBottom: '4px',
                        }}
                      >
                        {card.name}
                      </h3>
                      <p
                        style={{
                          fontSize: '14px',
                          color: '#525252',
                        }}
                      >
                        {card.bank}
                      </p>
                    </div>
                  </div>

                  {/* Valores */}
                  <div className="space-y-3 mb-4">
                    <div>
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
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#080B12',
                        }}
                      >
                        {formatCurrency(card.limit)}
                      </p>
                    </div>

                    <div>
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
                          fontSize: '20px',
                          fontWeight: '700',
                          color: usagePercentage > 80 ? '#EF4444' : '#080B12',
                        }}
                      >
                        {formatCurrency(card.currentBill)}
                      </p>
                    </div>

                    <div>
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
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#080B12',
                        }}
                      >
                        {formatCurrency(availableLimit)}
                      </p>
                    </div>

                    <div>
                      <p
                        style={{
                          fontSize: '12px',
                          color: '#525252',
                          marginBottom: '4px',
                        }}
                      >
                        Uso do limite
                      </p>
                      <p
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#525252',
                        }}
                      >
                        {usagePercentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Barra de Progresso */}
                  <div style={{ marginBottom: '16px' }}>
                    <div
                      style={{
                        width: '100%',
                        height: '8px',
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

                  {/* Datas */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p
                        style={{
                          fontSize: '12px',
                          color: '#525252',
                          marginBottom: '4px',
                        }}
                      >
                        Fechamento
                      </p>
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          style={{
                            width: '16px',
                            height: '16px',
                            color: '#525252',
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                          />
                        </svg>
                        <p
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#080B12',
                          }}
                        >
                          Dia {card.closingDay}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p
                        style={{
                          fontSize: '12px',
                          color: '#525252',
                          marginBottom: '4px',
                        }}
                      >
                        Vencimento
                      </p>
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          style={{
                            width: '16px',
                            height: '16px',
                            color: '#525252',
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                          />
                        </svg>
                        <p
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#080B12',
                          }}
                        >
                          Dia {card.dueDay}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Últimos dígitos */}
                  {card.lastDigits && (
                    <div style={{ marginBottom: '16px' }}>
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
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#080B12',
                          fontFamily: 'monospace',
                        }}
                      >
                        •••• {card.lastDigits}
                      </p>
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCardClick(card)
                      }}
                      style={{
                        flex: 1,
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: '#F5F6F8',
                        color: '#080B12',
                        fontSize: '14px',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Ver Detalhes
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddExpense(card.id)
                      }}
                      style={{
                        flex: 1,
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: '#080B12',
                        color: '#FFFFFF',
                        fontSize: '14px',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Adicionar Despesa
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modais */}
      <CardDetailsModal
        isOpen={isCardDetailsModalOpen}
        onClose={() => {
          setIsCardDetailsModalOpen(false)
          setSelectedCard(null)
        }}
        card={selectedCard}
      />

      <AddCardModal
        isOpen={isAddCardModalOpen}
        onClose={() => setIsAddCardModalOpen(false)}
      />

      <NewTransactionModal
        isOpen={isNewTransactionModalOpen}
        onClose={() => {
          setIsNewTransactionModalOpen(false)
          setPreselectedCardId(null)
        }}
        preselectedAccountId={preselectedCardId}
      />
    </div>
  )
}

export default Cards
