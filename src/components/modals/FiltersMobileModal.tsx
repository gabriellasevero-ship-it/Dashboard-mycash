import { useState, useEffect } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { Modal } from '@/components/ui/Modal'

interface FiltersMobileModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * FiltersMobileModal - Modal de filtros para mobile
 * Desliza de baixo para cima
 */
export function FiltersMobileModal({ isOpen, onClose }: FiltersMobileModalProps) {
  const { filters, setFilters, familyMembers } = useFinance()

  // Estado temporário dos filtros (não aplicados até clicar em "Aplicar")
  const [tempTransactionType, setTempTransactionType] = useState<'all' | 'income' | 'expense'>(
    filters.transactionType
  )
  const [tempSelectedMember, setTempSelectedMember] = useState<string | null>(
    filters.selectedMember
  )
  const [tempDateRange, setTempDateRange] = useState({
    startDate: filters.dateRange.startDate,
    endDate: filters.dateRange.endDate,
  })

  // Sincronizar estado temporário quando modal abre
  useEffect(() => {
    if (isOpen) {
      setTempTransactionType(filters.transactionType)
      setTempSelectedMember(filters.selectedMember)
      setTempDateRange({
        startDate: filters.dateRange.startDate,
        endDate: filters.dateRange.endDate,
      })
    }
  }, [isOpen, filters])

  // Aplicar filtros
  const handleApply = () => {
    setFilters({
      transactionType: tempTransactionType,
      selectedMember: tempSelectedMember,
      dateRange: tempDateRange,
    })
    onClose()
  }

  // Navegação de mês no calendário
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
  const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
  const daysInMonth = monthEnd.getDate()
  const firstDayOfWeek = monthStart.getDay()

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const isDateInRange = (day: number) => {
    if (!tempDateRange.startDate || !tempDateRange.endDate) return false
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return date >= tempDateRange.startDate && date <= tempDateRange.endDate
  }

  const isDateStart = (day: number) => {
    if (!tempDateRange.startDate) return false
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return date.getTime() === tempDateRange.startDate.getTime()
  }

  const isDateEnd = (day: number) => {
    if (!tempDateRange.endDate) return false
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return date.getTime() === tempDateRange.endDate.getTime()
  }

  const handleDateClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    if (!tempDateRange.startDate || tempDateRange.endDate) {
      // Resetar seleção
      setTempDateRange({ startDate: date, endDate: null })
    } else if (date < tempDateRange.startDate!) {
      // Data anterior à inicial, definir como nova inicial
      setTempDateRange({ startDate: date, endDate: null })
    } else {
      // Definir como data final
      setTempDateRange({ ...tempDateRange, endDate: date })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} fullscreen>
      <div
        className="flex flex-col h-screen"
        style={{
          animation: isOpen ? 'slideInUp 0.3s ease' : 'none',
        }}
      >
        {/* Header Fixo */}
        <div
          className="flex items-center justify-between flex-shrink-0"
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #E5E7EB',
            backgroundColor: '#FFFFFF',
          }}
        >
          <h2
            style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#080B12',
            }}
          >
            Filtros
          </h2>
          <button
            onClick={onClose}
            style={{
              width: '44px',
              height: '44px',
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
                width: '24px',
                height: '24px',
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
            padding: '24px',
            backgroundColor: '#FAFAFA',
          }}
        >
          {/* Tipo de Transação */}
          <div style={{ marginBottom: '32px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#080B12',
                marginBottom: '12px',
              }}
            >
              Tipo de Transação
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['all', 'income', 'expense'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setTempTransactionType(type)}
                  style={{
                    height: '48px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor:
                      tempTransactionType === type ? '#080B12' : '#FFFFFF',
                    color: tempTransactionType === type ? '#FFFFFF' : '#080B12',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: tempTransactionType === type ? 'none' : '1px solid #E5E7EB',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {type === 'all' ? 'Todos' : type === 'income' ? 'Receitas' : 'Despesas'}
                </button>
              ))}
            </div>
          </div>

          {/* Membro da Família */}
          <div style={{ marginBottom: '32px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#080B12',
                marginBottom: '12px',
              }}
            >
              Membro da Família
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTempSelectedMember(null)}
                style={{
                  height: '48px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: tempSelectedMember === null ? '#080B12' : '#FFFFFF',
                  color: tempSelectedMember === null ? '#FFFFFF' : '#080B12',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: tempSelectedMember === null ? 'none' : '1px solid #E5E7EB',
                  cursor: 'pointer',
                }}
              >
                Todos
              </button>
              {familyMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() =>
                    setTempSelectedMember(
                      tempSelectedMember === member.id ? null : member.id
                    )
                  }
                  className="flex items-center gap-2"
                  style={{
                    height: '48px',
                    paddingLeft: '12px',
                    paddingRight: '16px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor:
                      tempSelectedMember === member.id ? '#080B12' : '#FFFFFF',
                    color: tempSelectedMember === member.id ? '#FFFFFF' : '#080B12',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: tempSelectedMember === member.id ? 'none' : '1px solid #E5E7EB',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#D9D9D9',
                      border:
                        tempSelectedMember === member.id
                          ? '2px solid #FFFFFF'
                          : '2px solid transparent',
                    }}
                  />
                  {member.name}
                </button>
              ))}
            </div>
          </div>

          {/* Período - Calendário */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#080B12',
                marginBottom: '12px',
              }}
            >
              Período
            </label>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
              }}
            >
              {/* Navegação do mês */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => {
                    const prevMonth = new Date(currentMonth)
                    prevMonth.setMonth(prevMonth.getMonth() - 1)
                    setCurrentMonth(prevMonth)
                  }}
                  style={{
                    width: '40px',
                    height: '40px',
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
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#080B12',
                  }}
                >
                  {currentMonth.toLocaleDateString('pt-BR', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <button
                  onClick={() => {
                    const nextMonth = new Date(currentMonth)
                    nextMonth.setMonth(nextMonth.getMonth() + 1)
                    setCurrentMonth(nextMonth)
                  }}
                  style={{
                    width: '40px',
                    height: '40px',
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
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </div>

              {/* Dias da semana */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                  <div
                    key={day}
                    style={{
                      textAlign: 'center',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#525252',
                      padding: '8px',
                    }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Dias do mês */}
              <div className="grid grid-cols-7 gap-1">
                {/* Espaços vazios antes do primeiro dia */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {/* Dias */}
                {days.map((day) => {
                  const inRange = isDateInRange(day)
                  const isStart = isDateStart(day)
                  const isEnd = isDateEnd(day)

                  return (
                    <button
                      key={day}
                      onClick={() => handleDateClick(day)}
                      style={{
                        aspectRatio: '1',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor:
                          isStart || isEnd
                            ? '#080B12'
                            : inRange
                            ? 'rgba(8, 11, 18, 0.1)'
                            : 'transparent',
                        color: isStart || isEnd ? '#FFFFFF' : '#080B12',
                        fontSize: '14px',
                        fontWeight: isStart || isEnd ? '700' : '400',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!inRange && !isStart && !isEnd) {
                          e.currentTarget.style.backgroundColor = '#F5F6F8'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!inRange && !isStart && !isEnd) {
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }
                      }}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Fixo */}
        <div
          className="flex-shrink-0"
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #E5E7EB',
            backgroundColor: '#FFFFFF',
          }}
        >
          <button
            onClick={handleApply}
            style={{
              width: '100%',
              height: '56px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#080B12',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </Modal>
  )
}
