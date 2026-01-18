import { useState, useEffect } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { Modal } from '@/components/ui/Modal'
import { parseCurrencyInput } from '@/utils/formatters'

interface AddMemberModalProps {
  isOpen: boolean
  onClose: () => void
}

const ROLE_SUGGESTIONS = ['Pai', 'Mãe', 'Filho', 'Filha', 'Avô', 'Avó', 'Tio', 'Tia']

/**
 * AddMemberModal - Modal para adicionar membro da família
 */
export function AddMemberModal({ isOpen, onClose }: AddMemberModalProps) {
  const { addFamilyMember } = useFinance()

  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [roleInput, setRoleInput] = useState('')
  const [showRoleSuggestions, setShowRoleSuggestions] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarType, setAvatarType] = useState<'url' | 'upload'>('url')
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Resetar formulário quando modal abre
  useEffect(() => {
    if (isOpen) {
      setName('')
      setRole('')
      setRoleInput('')
      setShowRoleSuggestions(false)
      setAvatarUrl('')
      setAvatarType('url')
      setMonthlyIncome('')
      setErrors({})
    }
  }, [isOpen])

  // Filtrar sugestões de função
  const filteredSuggestions = ROLE_SUGGESTIONS.filter((suggestion) =>
    suggestion.toLowerCase().includes(roleInput.toLowerCase())
  )

  // Validação
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (name.trim().length < 3) {
      newErrors.name = 'Por favor, insira um nome válido'
    }

    if (!role.trim()) {
      newErrors.role = 'Por favor, informe a função na família'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Salvar membro
  const handleSave = () => {
    if (!validate()) return

    addFamilyMember({
      name: name.trim(),
      role: role.trim(),
      avatar: avatarUrl.trim() || undefined,
      monthlyIncome: monthlyIncome ? parseCurrencyInput(monthlyIncome) : 0,
    })

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
            Novo familiar
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
          <p
            style={{
              fontSize: '14px',
              color: '#525252',
              marginBottom: '24px',
            }}
          >
            Adicione alguém para participar do controle financeiro.
          </p>

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
              Nome Completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: João Silva"
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

          {/* Função/Papel */}
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
              Função / Parentesco
            </label>
            <div className="relative">
              <input
                type="text"
                value={roleInput}
                onChange={(e) => {
                  setRoleInput(e.target.value)
                  setRole(e.target.value)
                  setShowRoleSuggestions(true)
                }}
                onFocus={() => setShowRoleSuggestions(true)}
                placeholder="Ex: Pai, Mãe, Filho..."
                style={{
                  width: '100%',
                  height: '56px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  borderRadius: 'var(--radius-lg)',
                  border: `1px solid ${errors.role ? '#EF4444' : '#E5E7EB'}`,
                  backgroundColor: '#FFFFFF',
                  fontSize: '16px',
                  color: '#080B12',
                }}
              />
              {showRoleSuggestions && filteredSuggestions.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    zIndex: 10,
                    maxHeight: '200px',
                    overflowY: 'auto',
                  }}
                >
                  {filteredSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setRole(suggestion)
                        setRoleInput(suggestion)
                        setShowRoleSuggestions(false)
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: '14px',
                        color: '#080B12',
                        backgroundColor: 'transparent',
                        border: 'none',
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
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.role && (
              <p style={{ marginTop: '4px', fontSize: '12px', color: '#EF4444' }}>
                {errors.role}
              </p>
            )}
          </div>

          {/* Avatar */}
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
              Avatar (opcional)
            </label>
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setAvatarType('url')}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: avatarType === 'url' ? '#080B12' : '#F5F6F8',
                  color: avatarType === 'url' ? '#FFFFFF' : '#080B12',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                URL
              </button>
              <button
                onClick={() => setAvatarType('upload')}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: avatarType === 'upload' ? '#080B12' : '#F5F6F8',
                  color: avatarType === 'upload' ? '#FFFFFF' : '#080B12',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Upload
              </button>
            </div>
            {avatarType === 'url' ? (
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://exemplo.com/avatar.jpg"
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
            ) : (
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file && file.size <= 5 * 1024 * 1024) {
                    // TODO: Implementar upload real
                    // Por enquanto, apenas simular
                    setAvatarUrl(URL.createObjectURL(file))
                  }
                }}
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
            )}
          </div>

          {/* Renda Mensal */}
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
              Renda Mensal Estimada (opcional)
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
                value={monthlyIncome}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d,]/g, '')
                  setMonthlyIncome(value)
                }}
                placeholder="0,00"
                style={{
                  width: '100%',
                  height: '56px',
                  paddingLeft: '48px',
                  paddingRight: '16px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#FFFFFF',
                  fontSize: '16px',
                  color: '#080B12',
                }}
              />
            </div>
          </div>
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
            Adicionar Membro
          </button>
        </div>
      </div>
    </Modal>
  )
}
