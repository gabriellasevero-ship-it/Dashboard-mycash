import { ReactNode, useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  fullscreen?: boolean
}

/**
 * Modal - Componente base reutilizável para modais
 * Suporta fullscreen (100% viewport) ou modal centralizado
 */
export function Modal({ isOpen, onClose, children, fullscreen = false }: ModalProps) {
  // Fechar ao pressionar ESC
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevenir scroll do body quando modal aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  if (fullscreen) {
    return (
      <div
        className="fixed inset-0 z-50"
        style={{
          backgroundColor: '#FFFFFF',
        }}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      {children}
    </div>
  )
}
