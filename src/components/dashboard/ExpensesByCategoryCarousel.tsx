import { useState, useRef, useEffect } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { CategoryDonutCard } from './CategoryDonutCard'

/**
 * ExpensesByCategoryCarousel - Carrossel horizontal de categorias de despesas
 * Usa calculateCategoryPercentage para obter percentuais
 * Cores rotativas: verde-limão, preto, cinza médio
 * 
 * Funcionalidades:
 * - Scroll horizontal por mouse wheel
 * - Clique e arrasta (drag)
 * - Setas de navegação (aparecem no hover, desaparecem quando mouse sai)
 * - Gradiente de máscara nas bordas
 * - Sem setas no mobile
 */
export function ExpensesByCategoryCarousel() {
  const { calculateCategoryPercentage } = useFinance()
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // Obter dados de categorias com percentuais
  const categories = calculateCategoryPercentage()

  // Cores rotativas: verde-limão, preto, cinza médio
  const colors = ['#D7FF00', '#080B12', '#525252']

  // Handler para scroll por mouse wheel (horizontal)
  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return

    const handleWheel = (e: WheelEvent) => {
      // Prevenir scroll vertical padrão
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        e.preventDefault()
        carousel.scrollLeft += e.deltaY
      }
    }

    carousel.addEventListener('wheel', handleWheel, { passive: false })
    return () => carousel.removeEventListener('wheel', handleWheel)
  }, [])

  // Handlers para clique e arrasta
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    if (carouselRef.current) {
      setStartX(e.pageX - carouselRef.current.offsetLeft)
      setScrollLeft(carouselRef.current.scrollLeft)
    }
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    setIsHovered(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return
    e.preventDefault()
    const x = e.pageX - carouselRef.current.offsetLeft
    const walk = (x - startX) * 2 // Velocidade do scroll
    carouselRef.current.scrollLeft = scrollLeft - walk
  }

  // Função para scroll com setas
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return
    const scrollAmount = 200
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  if (categories.length === 0) {
    return (
      <div
        style={{
          padding: 'var(--spacing-lg)',
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
        }}
      >
        Nenhuma despesa encontrada para o período selecionado
      </div>
    )
  }

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Setas de navegação - apenas desktop */}
      {isHovered && (
        <>
          {/* Seta esquerda */}
          <button
            onClick={() => scrollCarousel('left')}
            className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid #E5E7EB',
              cursor: 'pointer',
              transition: 'opacity 0.2s ease',
            }}
            aria-label="Scroll para esquerda"
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Seta direita */}
          <button
            onClick={() => scrollCarousel('right')}
            className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid #E5E7EB',
              cursor: 'pointer',
              transition: 'opacity 0.2s ease',
            }}
            aria-label="Scroll para direita"
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}

      {/* Container do carrossel com gradiente de máscara */}
      <div
        className="relative"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        }}
      >
        <div
          ref={carouselRef}
          className="flex overflow-x-auto scrollbar-hide"
          style={{
            paddingLeft: 'var(--spacing-lg)',
            paddingRight: 'var(--spacing-lg)',
            paddingTop: 'var(--spacing-md)',
            paddingBottom: 'var(--spacing-md)',
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none', /* IE/Edge */
            gap: '18px', /* itemSpacing exato do Figma para o carrossel horizontal */
          }}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {/* Esconder scrollbar no Chrome/Safari */}
          <style>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {categories.map((item, index) => (
            <CategoryDonutCard
              key={item.category}
              category={item.category}
              amount={item.amount}
              percentage={item.percentage}
              color={colors[index % colors.length]} /* Rotação de cores */
            />
          ))}
        </div>
      </div>
    </div>
  )
}
