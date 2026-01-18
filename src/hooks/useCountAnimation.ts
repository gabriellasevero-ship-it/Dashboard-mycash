import { useState, useEffect } from 'react'

/**
 * Hook para animação de contagem numérica
 * Anima de zero até o valor final em aproximadamente 800ms
 */
export function useCountAnimation(
  targetValue: number,
  duration: number = 800
): number {
  const [currentValue, setCurrentValue] = useState(0)

  useEffect(() => {
    // Reset para zero quando valor muda
    setCurrentValue(0)

    // Calcular incrementos para animação suave
    const steps = 60 // Número de frames (~60fps)
    const stepDuration = duration / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      
      if (currentStep >= steps) {
        setCurrentValue(targetValue)
        clearInterval(interval)
      } else {
        // Easing: ease-out (mais rápido no início, mais lento no fim)
        const progress = currentStep / steps
        const easedProgress = 1 - Math.pow(1 - progress, 3) // Cubic ease-out
        setCurrentValue(targetValue * easedProgress)
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [targetValue, duration])

  return currentValue
}
