import { useState, useEffect } from 'react'

/**
 * Hook para gerenciar estado da Sidebar (expanded/collapsed)
 * Persiste estado no localStorage
 */
export function useSidebarState() {
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    // Tenta recuperar do localStorage, padrão é expanded
    const saved = localStorage.getItem('sidebar-expanded')
    return saved !== null ? saved === 'true' : true
  })

  useEffect(() => {
    // Salva no localStorage quando mudar
    localStorage.setItem('sidebar-expanded', String(isExpanded))
  }, [isExpanded])

  const toggle = () => {
    setIsExpanded((prev) => !prev)
  }

  const expand = () => setIsExpanded(true)
  const collapse = () => setIsExpanded(false)

  return {
    isExpanded,
    toggle,
    expand,
    collapse,
  }
}
