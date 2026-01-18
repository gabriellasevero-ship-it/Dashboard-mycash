import { useState, useEffect } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { Modal } from '@/components/ui/Modal'
import { CreditCardTheme } from '@/types'
import { parseCurrencyInput } from '@/utils/formatters'

interface AddCardModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * AddCardModal - Modal para adicionar conta bancária ou cartão de crédito
 */
export function AddCardModal({ isOpen, onClose }: AddCardModalProps) {
  const { addBankAccount, addCreditCard, familyMembers } = useFinance()

  const [accountType, setAccountType] = useState<'bank' | 'credit'>('bank')
  const [name, setName] = useState('')
  const [holderId, setHolderId] = useState<string>('')
  const [balance, setBalance] = useState('')
  const [closingDay, setClosingDay] = useState('')
  const [dueDay, setDueDay] = useState('')
  const [limit, setLimit] = useState('')
  const [lastDigits, setLastDigits] = useState('')
  const [theme, setTheme] = useState<CreditCardTheme>('black')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Resetar formulário quando modal abre
  useEffect(() => {
    if (isOpen) {
      setAccountType('bank')
      setName('')
      setHolderId('')
      setBalance('')
      setClosingDay('')
      setDueDay('')
      setLimit('')
      setLastDigits('')
      setTheme('black')
      setErrors({})
    }
  }, [isOpen])

  // Validação
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (name.trim().length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres'
    }

    if (!holderId) {
      newErrors.holderId = 'Titular é obrigatório'
    }

    if (accountType === 'bank') {
      if (!balance) {
        newErrors.balance = 'Saldo inicial é obrigatório'
      }
    } else {
      const closing = parseInt(closingDay, 10)
      const due = parseInt(dueDay, 10)
      const limitValue = parseCurrencyInput(limit)

      if (!closingDay || closing < 1 || closing > 31) {
        newErrors.closingDay = 'Dia de fechamento deve ser entre 1 e 31'
      }

      if (!dueDay || due < 1 || due > 31) {
        newErrors.dueDay = 'Dia de vencimento deve ser entre 1 e 31'
      }

      if (limitValue <= 0) {
        newErrors.limit = 'Limite deve ser maior que zero'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Salvar
  const handleSave = () => {
    if (!validate()) return

    if (accountType === 'bank') {
      addBankAccount({
        name: name.trim(),
        bank: name.trim().split(' ')[0] || 'Banco',
        holderId,
        balance: parseCurrencyInput(balance),
        accountType: 'corrente',
      })
    } else {
      addCreditCard({
        name: name.trim(),
        bank: name.trim().split(' ')[0] || 'Banco',
        holderId,
        limit: parseCurrencyInput(limit),
        currentBill: 0,
        closingDay: parseInt(closingDay, 10),
        dueDay: parseInt(dueDay, 10),
        lastDigits: lastDigits || undefined,
        theme,
      })
    }

    // TODO: Mostrar toast de sucesso
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        style={{
          width: '100%',
          maxWidth: '600px',
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
            {accountType === 'bank' ? 'Nova conta' : 'Novo cartão'}
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
          {/* Toggle de Tipo */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '24px',
            }}
          >
            <button
              onClick={() => setAccountType('bank')}
              style={{
                flex: 1,
                padding: '12px 24px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: accountType === 'bank' ? '#080B12' : '#FFFFFF',
                color: accountType === 'bank' ? '#FFFFFF' : '#080B12',
                fontSize: '16px',
                fontWeight: '600',
                border: accountType === 'bank' ? 'none' : '1px solid #E5E7EB',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Conta bancária
            </button>
            <button
              onClick={() => setAccountType('credit')}
              style={{
                flex: 1,
                padding: '12px 24px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: accountType === 'credit' ? '#080B12' : '#FFFFFF',
                color: accountType === 'credit' ? '#FFFFFF' : '#080B12',
                fontSize: '16px',
                fontWeight: '600',
                border: accountType === 'credit' ? 'none' : '1px solid #E5E7EB',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Cartão de crédito
            </button>
          </div>

          {/* Nome */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#080B12',
                marginBottom: '8px',
              }}
            >
              {accountType === 'bank' ? 'Nome da conta' : 'Apelido do cartão'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={accountType === 'bank' ? 'Ex: Conta corrente Nubank' : 'Ex: XP black'}
              style={{
                width: '100%',
                height: '56px',
                paddingLeft: '16px',
                paddingRight: '16px',
                borderRadius: 'var(--radius-lg)',
                border: `1px solid ${errors.name ? '#EF4444' : '#E5E7EB'}`,
                backgroundColor: '#FFFFFF',
                fontSize: '16px',
                color: '#080B12',
              }}
            />
            {errors.name && (
              <p style={{ marginTop: '4px', fontSize: '12px', color: '#EF4444' }}>
                {errors.name}
              </p>
            )}
          </div>

          {/* Titular */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#080B12',
                marginBottom: '8px',
              }}
            >
              Responsável
            </label>
            <select
              value={holderId}
              onChange={(e) => setHolderId(e.target.value)}
              style={{
                width: '100%',
                height: '56px',
                paddingLeft: '16px',
                paddingRight: '16px',
                borderRadius: 'var(--radius-lg)',
                border: `1px solid ${errors.holderId ? '#EF4444' : '#E5E7EB'}`,
                backgroundColor: '#FFFFFF',
                fontSize: '16px',
                color: '#080B12',
                cursor: 'pointer',
              }}
            >
              <option value="">Selecione</option>
              {familyMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
            {errors.holderId && (
              <p style={{ marginTop: '4px', fontSize: '12px', color: '#EF4444' }}>
                {errors.holderId}
              </p>
            )}
          </div>

          {/* Campos condicionais para Conta Bancária */}
          {accountType === 'bank' && (
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#080B12',
                  marginBottom: '8px',
                }}
              >
                Saldo inicial
              </label>
              <div className="relative">
                <span
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#525252',
                  }}
                >
                  R$
                </span>
                <input
                  type="text"
                  value={balance}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d,]/g, '')
                    setBalance(value)
                  }}
                  placeholder="0,00"
                  style={{
                    width: '100%',
                    height: '56px',
                    paddingLeft: '48px',
                    paddingRight: '16px',
                    borderRadius: 'var(--radius-lg)',
                    border: `1px solid ${errors.balance ? '#EF4444' : '#E5E7EB'}`,
                    backgroundColor: '#FFFFFF',
                    fontSize: '16px',
                    color: '#080B12',
                  }}
                />
              </div>
              {errors.balance && (
                <p style={{ marginTop: '4px', fontSize: '12px', color: '#EF4444' }}>
                  {errors.balance}
                </p>
              )}
            </div>
          )}

          {/* Campos condicionais para Cartão de Crédito */}
          {accountType === 'credit' && (
            <>
              <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '24px' }}>
                {/* Dia de Fechamento */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#080B12',
                      marginBottom: '8px',
                    }}
                  >
                    Fechamento
                  </label>
                  <select
                    value={closingDay}
                    onChange={(e) => setClosingDay(e.target.value)}
                    style={{
                      width: '100%',
                      height: '56px',
                      paddingLeft: '16px',
                      paddingRight: '16px',
                      borderRadius: 'var(--radius-lg)',
                      border: `1px solid ${errors.closingDay ? '#EF4444' : '#E5E7EB'}`,
                      backgroundColor: '#FFFFFF',
                      fontSize: '16px',
                      color: '#080B12',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="">Dia</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  {errors.closingDay && (
                    <p style={{ marginTop: '4px', fontSize: '12px', color: '#EF4444' }}>
                      {errors.closingDay}
                    </p>
                  )}
                </div>

                {/* Dia de Vencimento */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#080B12',
                      marginBottom: '8px',
                    }}
                  >
                    Vencimento
                  </label>
                  <select
                    value={dueDay}
                    onChange={(e) => setDueDay(e.target.value)}
                    style={{
                      width: '100%',
                      height: '56px',
                      paddingLeft: '16px',
                      paddingRight: '16px',
                      borderRadius: 'var(--radius-lg)',
                      border: `1px solid ${errors.dueDay ? '#EF4444' : '#E5E7EB'}`,
                      backgroundColor: '#FFFFFF',
                      fontSize: '16px',
                      color: '#080B12',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="">Dia</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  {errors.dueDay && (
                    <p style={{ marginTop: '4px', fontSize: '12px', color: '#EF4444' }}>
                      {errors.dueDay}
                    </p>
                  )}
                </div>
              </div>

              {/* Limite Total */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#080B12',
                    marginBottom: '8px',
                  }}
                >
                  Limite total
                </label>
                <div className="relative">
                  <span
                    style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#525252',
                    }}
                  >
                    R$
                  </span>
                  <input
                    type="text"
                    value={limit}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d,]/g, '')
                      setLimit(value)
                    }}
                    placeholder="0,00"
                    style={{
                      width: '100%',
                      height: '56px',
                      paddingLeft: '48px',
                      paddingRight: '16px',
                      borderRadius: 'var(--radius-lg)',
                      border: `1px solid ${errors.limit ? '#EF4444' : '#E5E7EB'}`,
                      backgroundColor: '#FFFFFF',
                      fontSize: '16px',
                      color: '#080B12',
                    }}
                  />
                </div>
                {errors.limit && (
                  <p style={{ marginTop: '4px', fontSize: '12px', color: '#EF4444' }}>
                    {errors.limit}
                  </p>
                )}
              </div>

              {/* Últimos 4 dígitos */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#080B12',
                    marginBottom: '8px',
                  }}
                >
                  Número final (opcional)
                </label>
                <input
                  type="text"
                  value={lastDigits}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 4)
                    setLastDigits(value)
                  }}
                  placeholder="**** 5843"
                  style={{
                    width: '100%',
                    height: '56px',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid #E5E7EB',
                    backgroundColor: '#FFFFFF',
                    fontSize: '16px',
                    color: '#080B12',
                  }}
                />
              </div>

              {/* Tema Visual */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#080B12',
                    marginBottom: '12px',
                  }}
                >
                  Cor de identificação
                </label>
                <div className="flex gap-3">
                  {(['black', 'lime', 'white'] as CreditCardTheme[]).map((themeOption) => (
                    <button
                      key={themeOption}
                      onClick={() => setTheme(themeOption)}
                      style={{
                        flex: 1,
                        height: '80px',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor:
                          themeOption === 'black'
                            ? '#080B12'
                            : themeOption === 'lime'
                            ? '#D7FF00'
                            : '#FFFFFF',
                        border:
                          theme === themeOption
                            ? '3px solid #3247FF'
                            : themeOption === 'white'
                            ? '1px solid #E5E7EB'
                            : 'none',
                        color:
                          themeOption === 'white' ? '#080B12' : '#FFFFFF',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {themeOption === 'black'
                        ? 'Black'
                        : themeOption === 'lime'
                        ? 'Lime'
                        : 'White'}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-4 flex-shrink-0"
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
            Cancelar
          </button>
          <button
            onClick={handleSave}
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
            Salvar
          </button>
        </div>
      </div>
    </Modal>
  )
}
