import { useState } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { CreditCardItem } from './CreditCardItem'
import { CardDetailsModal } from '@/components/modals/CardDetailsModal'
import { AddCardModal } from '@/components/modals/AddCardModal'

/**
 * CreditCardsWidget - Widget de cartões de crédito
 * Container com fundo cinza claro, lista vertical de cartões
 * 
 * Valores do Figma (extraídos conforme design):
 * - Título "Cartões": fontSize 18px, fontWeight 600, lineHeight 24px
 * - Padding interno: conforme espaçamento do design system
 */
const CARDS_PER_PAGE = 3

export function CreditCardsWidget() {
  const { creditCards } = useFinance()
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedCard, setSelectedCard] = useState<typeof creditCards[0] | null>(null)
  const [isCardDetailsModalOpen, setIsCardDetailsModalOpen] = useState(false)
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false)

  // Paginação
  const totalPages = Math.ceil(creditCards.length / CARDS_PER_PAGE)
  const displayedCards = creditCards.slice(
    currentPage * CARDS_PER_PAGE,
    (currentPage + 1) * CARDS_PER_PAGE
  )

  const handleCardClick = (cardId: string) => {
    const card = creditCards.find((c) => c.id === cardId)
    if (card) {
      setSelectedCard(card)
      setIsCardDetailsModalOpen(true)
    }
  }

  const handleAddCard = () => {
    setIsAddCardModalOpen(true)
  }

  if (creditCards.length === 0) {
    return (
      <div
        style={{
          borderRadius: '20px', /* Bordas amplamente arredondadas */
          backgroundColor: '#F5F6F8', /* Cinza muito claro do Figma */
          padding: '24px',
          minHeight: '200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
        }}
      >
        <p style={{ color: '#525252', fontSize: '14px' }}>
          Nenhum cartão cadastrado
        </p>
        <button
          onClick={handleAddCard}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            backgroundColor: '#080B12',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Adicionar Cartão
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        borderRadius: '20px', /* Bordas amplamente arredondadas */
        backgroundColor: '#F5F6F8', /* Cinza muito claro do Figma */
        padding: '24px', /* Espaçamento interno confortável */
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
          {/* Ícone de cartão de crédito */}
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
              d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
            />
          </svg>
          <h3
            style={{
              fontSize: '18px', /* Font size do Figma */
              fontWeight: '600', /* Semibold do Figma */
              lineHeight: '24px', /* Line height do Figma */
              color: '#080B12',
            }}
          >
            Cartões
          </h3>
        </div>

        {/* Botão "+" à direita */}
        <button
          onClick={handleAddCard}
          className="flex items-center justify-center"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
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
          aria-label="Adicionar cartão"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            style={{
              width: '16px',
              height: '16px',
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

      {/* Lista de cartões */}
      <div className="flex flex-col gap-3" style={{ gap: '12px' }}>
        {displayedCards.map((card) => (
          <CreditCardItem
            key={card.id}
            card={card}
            onClick={() => handleCardClick(card.id)}
          />
        ))}
      </div>

      {/* Paginação (se houver mais de 3 cartões) */}
      {totalPages > 1 && (
        <div
          className="flex items-center justify-center gap-2 mt-4"
          style={{
            marginTop: '16px',
            gap: '8px',
          }}
        >
          <button
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: currentPage === 0 ? '#F5F6F8' : '#FFFFFF',
              border: '1px solid #E5E7EB',
              color: currentPage === 0 ? '#A3A3A3' : '#080B12',
              cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'background-color 0.2s ease',
            }}
          >
            Anterior
          </button>

          <span
            style={{
              fontSize: '14px',
              color: '#525252',
            }}
          >
            {currentPage + 1} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: currentPage === totalPages - 1 ? '#F5F6F8' : '#FFFFFF',
              border: '1px solid #E5E7EB',
              color: currentPage === totalPages - 1 ? '#A3A3A3' : '#080B12',
              cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'background-color 0.2s ease',
            }}
          >
            Próxima
          </button>
        </div>
      )}

      {/* Modais */}
      {selectedCard && (
        <CardDetailsModal
          isOpen={isCardDetailsModalOpen}
          onClose={() => {
            setIsCardDetailsModalOpen(false)
            setSelectedCard(null)
          }}
          card={selectedCard}
        />
      )}

      <AddCardModal
        isOpen={isAddCardModalOpen}
        onClose={() => setIsAddCardModalOpen(false)}
      />
    </div>
  )
}
