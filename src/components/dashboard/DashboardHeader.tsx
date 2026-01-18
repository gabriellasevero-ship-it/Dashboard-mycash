import { useState, useRef, useEffect } from 'react'
import { useFinance } from '@/contexts/FinanceContext'

/**
 * Componente DashboardHeader
 * Barra de controles no topo do dashboard com busca, filtros, período e membros
 * 
 * Responsivo:
 * - Desktop: layout horizontal compacto
 * - Mobile: layout em coluna, botão "Nova Transação" largura total
 * 
 * Seguindo Figma MCP como fonte da verdade
 * Usa exclusivamente tokens do design system
 */
export function DashboardHeader() {
  const { filters, setFilters, familyMembers } = useFinance()
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false)
  const [isPeriodSelectorOpen, setIsPeriodSelectorOpen] = useState(false)
  const filterPopoverRef = useRef<HTMLDivElement>(null)
  const periodSelectorRef = useRef<HTMLDivElement>(null)

  // Fechar popovers ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterPopoverRef.current &&
        !filterPopoverRef.current.contains(event.target as Node)
      ) {
        setIsFilterPopoverOpen(false)
      }
      if (
        periodSelectorRef.current &&
        !periodSelectorRef.current.contains(event.target as Node)
      ) {
        setIsPeriodSelectorOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Atualizar busca em tempo real
  const handleSearchChange = (value: string) => {
    setFilters({ searchText: value })
  }

  // Formatar período para exibição
  const formatPeriod = () => {
    if (filters.dateRange.startDate && filters.dateRange.endDate) {
      const start = new Date(filters.dateRange.startDate)
      const end = new Date(filters.dateRange.endDate)
      const startDay = start.getDate()
      const endDay = end.getDate()
      const startMonth = start.toLocaleDateString('pt-BR', { month: 'short' })
      const endMonth = end.toLocaleDateString('pt-BR', { month: 'short' })
      const year = end.getFullYear()
      
      if (startMonth === endMonth && start.getFullYear() === end.getFullYear()) {
        return `${startDay} ${startMonth} - ${endDay} ${endMonth}, ${year}`
      }
      return `${startDay} ${startMonth} - ${endDay} ${endMonth}, ${year}`
    }
    return 'Selecionar período'
  }

  return (
    <div
      className="w-full"
      style={{
        paddingTop: 'var(--spacing-lg)',
        paddingBottom: 'var(--spacing-lg)',
      }}
    >
      <div
        className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6"
      >
        {/* Campo de busca */}
        <div
          className="relative flex-1 lg:max-w-sm"
          style={{
            width: '100%',
            minWidth: '200px',
          }}
        >
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
                width: '20px',
                height: '20px',
                color: 'var(--color-text-tertiary)',
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
            placeholder="Pesquisar..."
            value={filters.searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full"
            style={{
              paddingLeft: 'var(--spacing-3xl)',
              paddingRight: 'var(--spacing-md)',
              paddingTop: 'var(--spacing-md)',
              paddingBottom: 'var(--spacing-md)',
              borderRadius: 'var(--radius-lg)',
              border: `1px solid var(--color-border)`,
              backgroundColor: 'var(--color-surface)',
              fontSize: 'var(--font-size-base)',
              color: 'var(--color-text-primary)',
              minHeight: '48px', /* Touch target mínimo mobile */
            }}
          />
        </div>

        {/* Botão de filtros e seletor de período - agrupados */}
        <div className="flex items-center gap-3">
          {/* Botão Filtros */}
          <div className="relative" ref={filterPopoverRef}>
            <button
              onClick={() => setIsFilterPopoverOpen(!isFilterPopoverOpen)}
              className="flex items-center justify-center"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: isFilterPopoverOpen 
                  ? 'var(--color-text-primary)' 
                  : 'var(--color-surface)',
                border: `1px solid var(--color-border)`,
                color: isFilterPopoverOpen 
                  ? 'var(--color-text-inverse)' 
                  : 'var(--color-text-primary)',
                cursor: 'pointer',
                transition: 'var(--transition-color)',
              }}
              aria-label="Filtros"
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
                  d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                />
              </svg>
            </button>

            {/* FilterPopover - Desktop */}
            {isFilterPopoverOpen && (
              <div
                className="hidden lg:block absolute top-full right-0 mt-2 z-50"
                style={{
                  minWidth: '200px',
                  padding: 'var(--spacing-md)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: 'var(--shadow-lg)',
                  border: `1px solid var(--color-border)`,
                }}
              >
                <div
                  style={{
                    marginBottom: 'var(--spacing-md)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  Tipo de Transação
                </div>
                <div className="flex flex-col gap-2">
                  {(['all', 'income', 'expense'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setFilters({ transactionType: type })
                        setIsFilterPopoverOpen(false)
                      }}
                      className="text-left"
                      style={{
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor:
                          filters.transactionType === type
                            ? 'var(--color-text-primary)'
                            : 'transparent',
                        color:
                          filters.transactionType === type
                            ? 'var(--color-text-inverse)'
                            : 'var(--color-text-primary)',
                        fontSize: 'var(--font-size-sm)',
                        cursor: 'pointer',
                        transition: 'var(--transition-color)',
                      }}
                    >
                      {type === 'all' && 'Todos'}
                      {type === 'income' && 'Receitas'}
                      {type === 'expense' && 'Despesas'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Seletor de Período */}
          <div className="relative" ref={periodSelectorRef}>
            <button
              onClick={() => setIsPeriodSelectorOpen(!isPeriodSelectorOpen)}
              className="flex items-center gap-2"
              style={{
                paddingLeft: 'var(--spacing-md)',
                paddingRight: 'var(--spacing-md)',
                paddingTop: 'var(--spacing-sm)',
                paddingBottom: 'var(--spacing-sm)',
                borderRadius: 'var(--radius-lg)',
                border: `1px solid var(--color-border)`,
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-sm)',
                cursor: 'pointer',
                transition: 'var(--transition-color)',
                minHeight: '48px', /* Touch target mínimo mobile */
              }}
            >
              <span>{formatPeriod()}</span>
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
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                />
              </svg>
            </button>

            {/* Seletor de Período com Atalhos Rápidos */}
            {isPeriodSelectorOpen && (
              <div
                className="hidden lg:block absolute top-full right-0 mt-2 z-50"
                style={{
                  padding: 'var(--spacing-lg)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--color-surface)',
                  boxShadow: 'var(--shadow-lg)',
                  border: `1px solid var(--color-border)`,
                  minWidth: '300px',
                }}
              >
                <div
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--spacing-md)',
                  }}
                >
                  Período
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { label: 'Este mês', days: 0 },
                    { label: 'Mês passado', days: 30 },
                    { label: 'Últimos 3 meses', days: 90 },
                    { label: 'Este ano', days: 365 },
                  ].map((period) => {
                    const now = new Date()
                    const startDate = new Date(now)
                    startDate.setDate(startDate.getDate() - period.days)
                    const endDate = new Date(now)

                    return (
                      <button
                        key={period.label}
                        onClick={() => {
                          setFilters({
                            dateRange: {
                              startDate,
                              endDate,
                            },
                          })
                          setIsPeriodSelectorOpen(false)
                        }}
                        className="text-left"
                        style={{
                          padding: 'var(--spacing-sm) var(--spacing-md)',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'transparent',
                          color: 'var(--color-text-primary)',
                          fontSize: 'var(--font-size-sm)',
                          cursor: 'pointer',
                          transition: 'var(--transition-color)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                      >
                        {period.label}
                      </button>
                    )
                  })}
                </div>
                <div
                  style={{
                    marginTop: 'var(--spacing-md)',
                    paddingTop: 'var(--spacing-md)',
                    borderTop: `1px solid var(--color-border)`,
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-tertiary)',
                  }}
                >
                  Calendário completo em desenvolvimento
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Widget Membros da Família */}
        <div className="flex items-center gap-2">
          <div className="flex items-center" style={{ marginLeft: '-8px' }}>
            {familyMembers.slice(0, 3).map((member, index) => (
              <button
                key={member.id}
                onClick={() => {
                  if (filters.selectedMember === member.id) {
                    setFilters({ selectedMember: null })
                  } else {
                    setFilters({ selectedMember: member.id })
                  }
                }}
                className="relative transition-transform hover:scale-110"
                style={{
                  marginLeft: index > 0 ? '-8px' : '0',
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-full)',
                  border: `2px solid ${
                    filters.selectedMember === member.id
                      ? 'var(--color-text-primary)'
                      : 'var(--color-surface)'
                  }`,
                  backgroundColor: '#D9D9D9', /* avatar-fill-0 do Figma */
                  cursor: 'pointer',
                  zIndex: familyMembers.length - index,
                  transition: 'var(--transition-transform)',
                }}
                title={member.name}
              >
                {filters.selectedMember === member.id && (
                  <div
                    className="absolute -bottom-1 -right-1 flex items-center justify-center"
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--color-primary)',
                      border: '2px solid var(--color-surface)',
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                      stroke="var(--color-text-primary)"
                      style={{
                        width: '12px',
                        height: '12px',
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </div>
                )}
                <span
                  className="flex items-center justify-center h-full font-semibold"
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  {member.name.charAt(0)}
                </span>
              </button>
            ))}
          </div>

          {/* Botão adicionar membro */}
          <button
            className="flex items-center justify-center"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-full)',
              border: `2px solid var(--color-border)`,
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              transition: 'var(--transition-color)',
            }}
            aria-label="Adicionar membro"
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

        {/* Botão Nova Transação */}
        <button
          className="lg:w-auto w-full flex items-center justify-center gap-2"
          style={{
            paddingLeft: 'var(--spacing-lg)',
            paddingRight: 'var(--spacing-lg)',
            paddingTop: 'var(--spacing-md)',
            paddingBottom: 'var(--spacing-md)',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--color-text-primary)',
            color: 'var(--color-text-inverse)',
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-semibold)',
            cursor: 'pointer',
            transition: 'var(--transition-color)',
            minHeight: '48px', /* Touch target mínimo mobile */
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-secondary-hover)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-text-primary)'
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
          <span>Nova Transação</span>
        </button>
      </div>
    </div>
  )
}
