import { useState, useEffect, useMemo } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { Modal } from '@/components/ui/Modal'
import { TransactionType } from '@/types'
import { parseCurrencyInput, formatDate, parseDate } from '@/utils/formatters'

interface NewTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  preselectedAccountId?: string | null
}

/**
 * NewTransactionModal - Modal de Nova Transação
 * Formulário completo para adicionar receitas ou despesas
 */
export function NewTransactionModal({ isOpen, onClose, preselectedAccountId }: NewTransactionModalProps) {
  const { addTransaction, familyMembers, bankAccounts, creditCards, transactions } = useFinance()
  
  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [memberId, setMemberId] = useState<string | null>(null)
  const [accountId, setAccountId] = useState<string | null>(preselectedAccountId || null)
  const [installments, setInstallments] = useState(1)
  const [isRecurring, setIsRecurring] = useState(false)
  const [date, setDate] = useState(formatDate(new Date()))
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  // Resetar formulário quando modal abre
  useEffect(() => {
    if (isOpen) {
      setType('expense')
      setAmount('')
      setDescription('')
      setCategory('')
      setMemberId(null)
      setAccountId(preselectedAccountId || null)
      setInstallments(1)
      setIsRecurring(false)
      setDate(formatDate(new Date()))
      setErrors({})
      setShowNewCategory(false)
      setNewCategoryName('')
    }
  }, [isOpen, preselectedAccountId])

  // Obter categorias existentes filtradas por tipo
  const availableCategories = useMemo(() => {
    const categoriesSet = new Set<string>()
    transactions
      .filter((t) => t.type === type)
      .forEach((t) => categoriesSet.add(t.category))
    return Array.from(categoriesSet).sort()
  }, [transactions, type])

  // Verificar se conta selecionada é cartão de crédito
  const selectedAccount = useMemo(() => {
    if (!accountId) return null
    const creditCard = creditCards.find((c) => c.id === accountId)
    if (creditCard) return { type: 'creditCard' as const, data: creditCard }
    const bankAccount = bankAccounts.find((a) => a.id === accountId)
    if (bankAccount) return { type: 'bankAccount' as const, data: bankAccount }
    return null
  }, [accountId, creditCards, bankAccounts])

  const isCreditCard = selectedAccount?.type === 'creditCard'
  const showInstallments = isCreditCard && type === 'expense'

  // Criar nova categoria
  const handleCreateCategory = () => {
    if (newCategoryName.trim().length >= 3) {
      setCategory(newCategoryName.trim())
      setShowNewCategory(false)
      setNewCategoryName('')
    }
  }

  // Validação
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    const amountValue = parseCurrencyInput(amount)
    if (amountValue <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero'
    }

    if (description.trim().length < 3) {
      newErrors.description = 'Descrição deve ter pelo menos 3 caracteres'
    }

    if (!category) {
      newErrors.category = 'Categoria é obrigatória'
    }

    if (!accountId) {
      newErrors.accountId = 'Conta/Cartão é obrigatório'
    }

    const parsedDate = parseDate(date)
    if (!parsedDate) {
      newErrors.date = 'Data inválida'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Salvar transação
  const handleSave = () => {
    if (!validate()) return

    const amountValue = parseCurrencyInput(amount)
    const parsedDate = parseDate(date) || new Date()

    addTransaction({
      type,
      amount: amountValue,
      description: description.trim(),
      category: category.trim(),
      date: parsedDate,
      accountId,
      memberId,
      installments: showInstallments ? installments : 1,
      currentInstallment: showInstallments && installments > 1 ? 1 : undefined,
      status: 'completed',
      isRecurring: type === 'expense' ? isRecurring : false,
      isPaid: false,
    })

    // TODO: Mostrar toast de sucesso
    onClose()
  }

  // Formatar valor enquanto digita
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d,]/g, '')
    const numericValue = parseCurrencyInput(value)
    if (numericValue >= 0) {
      setAmount(value)
    }
  }

  // Quando parcelamento > 1, desabilitar recorrente
  useEffect(() => {
    if (installments > 1 && isRecurring) {
      setIsRecurring(false)
    }
  }, [installments])

  // Quando recorrente marcado, forçar parcelamento = 1
  useEffect(() => {
    if (isRecurring && installments > 1) {
      setInstallments(1)
    }
  }, [isRecurring])

  return (
    <Modal isOpen={isOpen} onClose={onClose} fullscreen>
      <div className="flex flex-col h-screen">
        {/* Header Fixo */}
        <div
          className="flex items-center justify-between flex-shrink-0"
          style={{
            padding: '24px 32px',
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          <div className="flex items-center gap-4" style={{ gap: '16px' }}>
            {/* Ícone grande conforme tipo */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: type === 'income' ? '#D7FF00' : '#080B12',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {type === 'income' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="#080B12"
                  style={{
                    width: '32px',
                    height: '32px',
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
                  stroke="#FFFFFF"
                  style={{
                    width: '32px',
                    height: '32px',
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

            <div>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#080B12',
                  marginBottom: '4px',
                }}
              >
                Nova transação
              </h2>
              <p
                style={{
                  fontSize: '14px',
                  color: '#525252',
                }}
              >
                Registre entradas e saídas para manter seu controle.
              </p>
            </div>
          </div>

          {/* Botão X */}
          <button
            onClick={onClose}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#F5F6F8',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E5E7EB'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F5F6F8'
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
            backgroundColor: '#FAFAFA',
            padding: '32px',
          }}
        >
          <div
            className="mx-auto"
            style={{
              maxWidth: '700px',
            }}
          >
            {/* Toggle de Tipo */}
            <div
              style={{
                backgroundColor: '#F5F6F8',
                borderRadius: 'var(--radius-lg)',
                padding: '4px',
                display: 'flex',
                gap: '4px',
                marginBottom: '24px',
              }}
            >
              <button
                onClick={() => setType('income')}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: type === 'income' ? '#FFFFFF' : 'transparent',
                  color: type === 'income' ? '#080B12' : '#525252',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: type === 'income' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                Receita
              </button>
              <button
                onClick={() => setType('expense')}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: type === 'expense' ? '#FFFFFF' : 'transparent',
                  color: type === 'expense' ? '#080B12' : '#525252',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: type === 'expense' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                Despesas
              </button>
            </div>

            {/* Campo Valor */}
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
                Valor da transação
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
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0,00"
                  style={{
                    width: '100%',
                    height: '56px',
                    paddingLeft: '48px',
                    paddingRight: '16px',
                    borderRadius: 'var(--radius-lg)',
                    border: `1px solid ${errors.amount ? '#EF4444' : '#E5E7EB'}`,
                    backgroundColor: '#FFFFFF',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#080B12',
                  }}
                />
              </div>
              {errors.amount && (
                <p style={{ marginTop: '4px', fontSize: '12px', color: '#EF4444' }}>
                  {errors.amount}
                </p>
              )}
            </div>

            {/* Grid: Data e Descrição */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginBottom: '24px' }}>
              {/* Data */}
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
                  Data
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="DD/MM/AAAA"
                    style={{
                      width: '100%',
                      height: '56px',
                      paddingLeft: '16px',
                      paddingRight: '48px',
                      borderRadius: 'var(--radius-lg)',
                      border: `1px solid ${errors.date ? '#EF4444' : '#E5E7EB'}`,
                      backgroundColor: '#FFFFFF',
                      fontSize: '16px',
                      color: '#080B12',
                    }}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '20px',
                      height: '20px',
                      color: '#525252',
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                    />
                  </svg>
                </div>
                {errors.date && (
                  <p style={{ marginTop: '4px', fontSize: '12px', color: '#EF4444' }}>
                    {errors.date}
                  </p>
                )}
              </div>

              {/* Descrição */}
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
                  Descrição
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="EX: Supermercado Semanal"
                  style={{
                    width: '100%',
                    height: '56px',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    borderRadius: 'var(--radius-lg)',
                    border: `1px solid ${errors.description ? '#EF4444' : '#E5E7EB'}`,
                    backgroundColor: '#FFFFFF',
                    fontSize: '16px',
                    color: '#080B12',
                  }}
                />
                {errors.description && (
                  <p style={{ marginTop: '4px', fontSize: '12px', color: '#EF4444' }}>
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            {/* Categoria */}
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
                Categoria
              </label>
              {!showNewCategory ? (
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      width: '100%',
                      height: '56px',
                      paddingLeft: '16px',
                      paddingRight: '16px',
                      borderRadius: 'var(--radius-lg)',
                      border: `1px solid ${errors.category ? '#EF4444' : '#E5E7EB'}`,
                      backgroundColor: '#FFFFFF',
                      fontSize: '16px',
                      color: '#080B12',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="">Selecione a categoria</option>
                    {availableCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setShowNewCategory(true)}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '12px',
                      color: '#080B12',
                      textDecoration: 'underline',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    + Nova categoria
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Nome da categoria"
                    style={{
                      flex: 1,
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
                  <button
                    onClick={handleCreateCategory}
                    style={{
                      padding: '0 16px',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: '#080B12',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => {
                      setShowNewCategory(false)
                      setNewCategoryName('')
                    }}
                    style={{
                      padding: '0 16px',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: '#F5F6F8',
                      color: '#080B12',
                      fontSize: '14px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
              {errors.category && (
                <p style={{ marginTop: '4px', fontSize: '12px', color: '#EF4444' }}>
                  {errors.category}
                </p>
              )}
            </div>

            {/* Grid: Membro e Conta/Cartão */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginBottom: '24px' }}>
              {/* Membro */}
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
                  Responsável
                </label>
                <select
                  value={memberId || ''}
                  onChange={(e) => setMemberId(e.target.value || null)}
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
                    cursor: 'pointer',
                  }}
                >
                  <option value="">Família (Geral)</option>
                  {familyMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Conta/Cartão */}
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
                  Conta / Cartão
                </label>
                <select
                  value={accountId || ''}
                  onChange={(e) => setAccountId(e.target.value || null)}
                  style={{
                    width: '100%',
                    height: '56px',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    borderRadius: 'var(--radius-lg)',
                    border: `1px solid ${errors.accountId ? '#EF4444' : '#E5E7EB'}`,
                    backgroundColor: '#FFFFFF',
                    fontSize: '16px',
                    color: '#080B12',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">Selecione</option>
                  <optgroup label="Contas Bancárias">
                    {bankAccounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name} - {account.bank}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Cartões de Crédito">
                    {creditCards.map((card) => (
                      <option key={card.id} value={card.id}>
                        {card.name} - {card.bank}
                      </option>
                    ))}
                  </optgroup>
                </select>
                {errors.accountId && (
                  <p style={{ marginTop: '4px', fontSize: '12px', color: '#EF4444' }}>
                    {errors.accountId}
                  </p>
                )}
              </div>
            </div>

            {/* Parcelamento (condicional) */}
            {showInstallments && (
              <div
                style={{
                  marginBottom: '24px',
                  animation: 'fadeIn 0.3s ease',
                }}
              >
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#080B12',
                    marginBottom: '8px',
                  }}
                >
                  Parcelamento
                </label>
                <select
                  value={installments}
                  onChange={(e) => setInstallments(Number(e.target.value))}
                  disabled={isRecurring}
                  style={{
                    width: '100%',
                    height: '56px',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid #E5E7EB',
                    backgroundColor: isRecurring ? '#F5F6F8' : '#FFFFFF',
                    fontSize: '16px',
                    color: isRecurring ? '#A3A3A3' : '#080B12',
                    cursor: isRecurring ? 'not-allowed' : 'pointer',
                  }}
                >
                  <option value={1}>À vista (1x)</option>
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                    <option key={num} value={num}>
                      {num}x
                    </option>
                  ))}
                </select>
                {isRecurring && (
                  <p
                    style={{
                      marginTop: '4px',
                      fontSize: '12px',
                      fontStyle: 'italic',
                      color: '#525252',
                    }}
                  >
                    Parcelamento desabilitado para despesas recorrentes
                  </p>
                )}
              </div>
            )}

            {/* Despesa Recorrente (condicional) */}
            {type === 'expense' && (
              <div
                style={{
                  marginBottom: '24px',
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'rgba(50, 71, 255, 0.05)',
                  border: '1px solid rgba(50, 71, 255, 0.2)',
                }}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="recurring"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    disabled={installments > 1}
                    style={{
                      width: '20px',
                      height: '20px',
                      marginTop: '2px',
                      cursor: installments > 1 ? 'not-allowed' : 'pointer',
                    }}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="recurring"
                      style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#080B12',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px',
                        cursor: installments > 1 ? 'not-allowed' : 'pointer',
                      }}
                    >
                      Despesa Recorrente
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
                          d="M16.023 9.348h4.992v-.001M2.25 18.002h18.75m-18.75 0a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 012.25-2.25h13.5a2.25 2.25 0 012.25 2.25v9.002a2.25 2.25 0 01-2.25 2.25z"
                        />
                      </svg>
                    </label>
                    <p
                      style={{
                        fontSize: '12px',
                        color: installments > 1 ? '#EF4444' : '#525252',
                      }}
                    >
                      {installments > 1
                        ? 'Não disponível para compras parceladas'
                        : 'Contas que se repetem todo mês (Netflix, Spotify, Academia, etc).'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Fixo */}
        <div
          className="flex items-center justify-end gap-4 flex-shrink-0"
          style={{
            padding: '24px 32px',
            borderTop: '1px solid #E5E7EB',
            backgroundColor: '#FFFFFF',
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
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F5F6F8'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '12px 32px',
              borderRadius: 'var(--radius-full)',
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
            Salvar transação
          </button>
        </div>
      </div>
    </Modal>
  )
}
