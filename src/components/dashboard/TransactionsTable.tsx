import { useState, useMemo, useEffect, useRef } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { formatCurrency } from '@/utils/formatters'
import { Transaction } from '@/types'

const ITEMS_PER_PAGE = 5

/**
 * TransactionsTable - Tabela completa de transações do dashboard
 * 
 * Funcionalidades:
 * - Filtros locais (busca + tipo) combinados com filtros globais
 * - Ordenação por data decrescente
 * - Paginação (5 itens por página)
 * - Zebra striping e hover
 */
export function TransactionsTable() {
  const { getFilteredTransactions, familyMembers, bankAccounts, creditCards } = useFinance()
  const [localSearch, setLocalSearch] = useState('')
  const [localType, setLocalType] = useState<'all' | 'income' | 'expense'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const tableRef = useRef<HTMLDivElement>(null)

  // Obter transações já filtradas pelos filtros globais
  const globalFiltered = getFilteredTransactions()

  // Aplicar filtros locais e ordenar por data decrescente
  const filteredTransactions = useMemo(() => {
    let filtered = [...globalFiltered]

    // Filtro local por tipo
    if (localType !== 'all') {
      filtered = filtered.filter((t) => t.type === localType)
    }

    // Filtro local por busca textual (descrição OU categoria)
    if (localSearch.trim()) {
      const searchLower = localSearch.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(searchLower) ||
          t.category.toLowerCase().includes(searchLower)
      )
    }

    // Ordenar por data decrescente (mais recente primeiro)
    filtered.sort((a, b) => b.date.getTime() - a.date.getTime())

    return filtered
  }, [globalFiltered, localType, localSearch])

  // Calcular paginação
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)

  // Resetar para página 1 quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1)
  }, [localSearch, localType, filteredTransactions.length])

  // Scroll suave para o topo ao mudar página
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Função para obter nome da conta/cartão
  const getAccountName = (accountId: string | null): string => {
    if (!accountId) return 'Desconhecido'

    const bankAccount = bankAccounts.find((a) => a.id === accountId)
    if (bankAccount) {
      return bankAccount.name || `${bankAccount.bank} conta`
    }

    const creditCard = creditCards.find((c) => c.id === accountId)
    if (creditCard) {
      return creditCard.name || `${creditCard.bank} cartão`
    }

    return 'Desconhecido'
  }

  // Função para obter membro
  const getMember = (memberId: string | null) => {
    if (!memberId) return null
    return familyMembers.find((m) => m.id === memberId) || null
  }

  // Formatar data como DD/MM/AAAA
  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Formatar parcelas
  const formatInstallments = (transaction: Transaction): string => {
    if (!transaction.installments || transaction.installments === 1) {
      return '-'
    }
    return `${transaction.installments}x`
  }

  // Gerar números de página com reticências se necessário
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | 'ellipsis')[] = []
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 'ellipsis', totalPages - 1, totalPages)
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, 2, 'ellipsis', totalPages - 2, totalPages - 1, totalPages)
    } else {
      pages.push(1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages)
    }

    return pages
  }

  return (
    <div ref={tableRef} className="w-full">
      {/* Header: Título + Controles */}
      <div
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        style={{
          marginBottom: '20px',
        }}
      >
        {/* Título à esquerda */}
        <div className="flex items-center gap-2" style={{ gap: '8px' }}>
          {/* Ícone de bandeira */}
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
              d="M3 3v18l8-6 8 6V3"
            />
          </svg>
          <h2
            style={{
              fontSize: '20px', /* Font size exato do Figma */
              fontWeight: '700', /* Bold do Figma */
              lineHeight: '28px', /* Line height exato do Figma */
              color: '#080B12',
            }}
          >
            Extrato detalhado
          </h2>
        </div>

        {/* Controles à direita */}
        <div className="flex flex-col sm:flex-row gap-3" style={{ gap: '12px' }}>
          {/* Campo de busca */}
          <div className="relative" style={{ width: '100%', maxWidth: '256px' }}>
            <div
              className="absolute inset-y-0 left-0 flex items-center pointer-events-none"
              style={{
                paddingLeft: 'var(--spacing-md)',
              }}
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
                  color: '#525252',
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar lançamentos..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: 'var(--spacing-3xl)',
                paddingRight: 'var(--spacing-md)',
                paddingTop: 'var(--spacing-sm)',
                paddingBottom: 'var(--spacing-sm)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                fontSize: 'var(--font-size-base)',
                color: '#080B12',
                minHeight: '40px',
              }}
            />
          </div>

          {/* Select de tipo */}
          <select
            value={localType}
            onChange={(e) => setLocalType(e.target.value as 'all' | 'income' | 'expense')}
            style={{
              width: '100%',
              minWidth: '140px',
              paddingLeft: 'var(--spacing-md)',
              paddingRight: 'var(--spacing-md)',
              paddingTop: 'var(--spacing-sm)',
              paddingBottom: 'var(--spacing-sm)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid #E5E7EB',
              backgroundColor: '#FFFFFF',
              fontSize: 'var(--font-size-base)',
              color: '#080B12',
              minHeight: '40px',
              cursor: 'pointer',
            }}
          >
            <option value="all">Todos</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
          </select>
        </div>
      </div>

      {/* Tabela */}
      <div
        style={{
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #E5E7EB',
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
        }}
      >
        {/* Header da tabela */}
        <div
          className="hidden lg:grid grid-cols-[50px_1fr_2fr_1fr_1fr_80px_120px] gap-4"
          style={{
            padding: '16px',
            backgroundColor: '#F5F6F8', /* Fundo cinza claro do header */
            borderBottom: '1px solid #E5E7EB',
            fontSize: '14px',
            fontWeight: '600',
            color: '#525252',
          }}
        >
          <div>Membro</div>
          <div>Datas</div>
          <div>Descrição</div>
          <div>Categorias</div>
          <div>Conta/cartão</div>
          <div>Parcelas</div>
          <div style={{ textAlign: 'right' }}>Valor</div>
        </div>

        {/* Corpo da tabela */}
        {paginatedTransactions.length === 0 ? (
          <div
            style={{
              padding: '96px 16px',
              textAlign: 'center',
              color: '#525252',
              fontSize: '14px',
            }}
          >
            Nenhum lançamento encontrado.
          </div>
        ) : (
          <div className="flex flex-col">
            {paginatedTransactions.map((transaction, index) => {
              const member = getMember(transaction.memberId)
              const isEven = index % 2 === 0
              
              return (
                <div
                  key={transaction.id}
                  className="hidden lg:grid grid-cols-[50px_1fr_2fr_1fr_1fr_80px_120px] gap-4 items-center"
                  style={{
                    padding: '16px',
                    backgroundColor: isEven ? '#FFFFFF' : '#FAFAFA', /* Zebra striping */
                    borderBottom: index < paginatedTransactions.length - 1 ? '1px solid #E5E7EB' : 'none',
                    transition: 'background-color 0.2s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F5F6F8' /* Hover cinza claro */
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isEven ? '#FFFFFF' : '#FAFAFA'
                  }}
                >
                  {/* Avatar */}
                  <div className="flex items-center justify-center">
                    {member ? (
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: '#D9D9D9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#080B12',
                        }}
                        title={member.name}
                      >
                        {member.name.charAt(0)}
                      </div>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        style={{
                          width: '20px',
                          height: '20px',
                          color: '#525252',
                        }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Data */}
                  <div style={{ fontSize: '14px', color: '#525252' }}>
                    {formatDate(transaction.date)}
                  </div>

                  {/* Descrição com ícone */}
                  <div className="flex items-center gap-2" style={{ gap: '8px' }}>
                    {/* Ícone de tipo */}
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor:
                          transaction.type === 'income' ? '#D1FAE5' : '#FEE2E2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {transaction.type === 'income' ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="#10B981"
                          style={{
                            width: '14px',
                            height: '14px',
                            transform: 'rotate(-45deg)',
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="#EF4444"
                          style={{
                            width: '14px',
                            height: '14px',
                            transform: 'rotate(135deg)',
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#080B12',
                      }}
                    >
                      {transaction.description}
                    </span>
                  </div>

                  {/* Categoria */}
                  <div>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: '#F5F6F8',
                        fontSize: '12px',
                        color: '#525252',
                      }}
                    >
                      {transaction.category}
                    </span>
                  </div>

                  {/* Conta/Cartão */}
                  <div style={{ fontSize: '14px', color: '#525252' }}>
                    {getAccountName(transaction.accountId)}
                  </div>

                  {/* Parcelas */}
                  <div style={{ fontSize: '14px', color: '#525252', textAlign: 'center' }}>
                    {formatInstallments(transaction)}
                  </div>

                  {/* Valor */}
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: transaction.type === 'income' ? '#10B981' : '#080B12',
                      textAlign: 'right',
                    }}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Paginação */}
      {filteredTransactions.length > 0 && (
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            marginTop: '16px',
          }}
        >
          {/* Contador à esquerda */}
          <div style={{ fontSize: '14px', color: '#525252' }}>
            Mostrando {startIndex + 1} a {Math.min(endIndex, filteredTransactions.length)} de{' '}
            {filteredTransactions.length}
          </div>

          {/* Controles de navegação à direita */}
          <div className="flex items-center gap-2" style={{ gap: '8px' }}>
            {/* Botão Anterior */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: currentPage === 1 ? '#F5F6F8' : '#FFFFFF',
                border: '1px solid #E5E7EB',
                color: currentPage === 1 ? '#A3A3A3' : '#080B12',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
              }}
            >
              ←
            </button>

            {/* Números de página */}
            {getPageNumbers().map((page, idx) => {
              if (page === 'ellipsis') {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    style={{
                      padding: '6px 8px',
                      fontSize: '14px',
                      color: '#525252',
                    }}
                  >
                    ...
                  </span>
                )
              }

              const isActive = page === currentPage
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isActive ? '#080B12' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#525252',
                    fontSize: '14px',
                    fontWeight: isActive ? '700' : '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: isActive ? 'none' : '1px solid transparent',
                  }}
                >
                  {page}
                </button>
              )
            })}

            {/* Botão Próxima */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: currentPage === totalPages ? '#F5F6F8' : '#FFFFFF',
                border: '1px solid #E5E7EB',
                color: currentPage === totalPages ? '#A3A3A3' : '#080B12',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
              }}
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
