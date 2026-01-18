import { formatCurrency } from '@/utils/formatters'

interface CategoryDonutCardProps {
  category: string
  amount: number
  percentage: number
  color: string // Cor do anel do donut
}

/**
 * CategoryDonutCard - Card individual de categoria com gráfico donut
 * Valores do Figma:
 * - Largura: 185px (exata do Figma)
 * - Altura: automática
 * - Padding: 24px (todos os lados)
 * - Border radius: 20px
 * - Donut: diâmetro 72px (exato do Figma)
 * - Inner radius: 0.77 (cerca de 77% do raio)
 */
export function CategoryDonutCard({ category, amount, percentage, color }: CategoryDonutCardProps) {
  // Diâmetro do donut: 72px do Figma
  const donutSize = 72
  const donutRadius = donutSize / 2
  // Inner radius: 0.77 (77% do raio total) do Figma
  const innerRadius = donutRadius * 0.77
  const strokeWidth = donutRadius - innerRadius // Largura do anel
  const centerRadius = (donutRadius + innerRadius) / 2 // Raio médio para o stroke
  
  // Calcular circunferência e offset para o stroke do donut
  const circumference = 2 * Math.PI * centerRadius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div
      className="flex-shrink-0"
      style={{
        width: '185px', /* Largura exata do Figma */
        padding: '24px', /* Padding exato do Figma */
        borderRadius: '20px', /* Corner radius exato do Figma */
        backgroundColor: '#FFFFFF', /* Branco */
        border: '1px solid #E5E7EB', /* Borda cinza clara do Figma */
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px', /* itemSpacing do Figma */
        transition: 'border-color 0.2s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#D7FF00' /* Verde-limão no hover */
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#E5E7EB' /* Volta ao cinza claro */
      }}
    >
      {/* Gráfico Donut */}
      <div className="relative flex items-center justify-center" style={{ width: `${donutSize}px`, height: `${donutSize}px` }}>
        {/* Círculo de fundo (cinza claro) */}
        <svg
          width={donutSize}
          height={donutSize}
          style={{
            position: 'absolute',
            transform: 'rotate(-90deg)', /* Rotaciona para começar do topo */
          }}
        >
          <circle
            cx={donutRadius}
            cy={donutRadius}
            r={donutRadius - strokeWidth / 2}
            fill="none"
            stroke="#E7E8EA" /* Cor do fundo do gráfico do Figma */
            strokeWidth={strokeWidth}
          />
        </svg>
        
        {/* Anel colorido (progresso) */}
        <svg
          width={donutSize}
          height={donutSize}
          style={{
            position: 'absolute',
            transform: 'rotate(-90deg)', /* Rotaciona para começar do topo */
          }}
        >
          <circle
            cx={donutRadius}
            cy={donutRadius}
            r={donutRadius - strokeWidth / 2}
            fill="none"
            stroke={color} /* Cor rotativa (verde-limão, preto, cinza médio) */
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.8s ease',
            }}
          />
        </svg>

        {/* Percentual no centro */}
        <div
          style={{
            position: 'absolute',
            fontSize: '12px', /* Font size exato do Figma */
            fontWeight: '400', /* Font weight do Figma */
            lineHeight: '20px', /* Line height exato do Figma */
            color: '#080B12', /* Cor do texto do Figma */
            textAlign: 'center',
          }}
        >
          {percentage.toFixed(1)}%
        </div>
      </div>

      {/* Nome da categoria */}
      <div
        style={{
          fontSize: '14px', /* Tamanho adequado para categoria */
          fontWeight: '400',
          color: '#080B12',
          textAlign: 'center',
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
        title={category}
      >
        {category}
      </div>

      {/* Valor formatado */}
      <div
        style={{
          fontSize: '16px', /* Tamanho para valor */
          fontWeight: '700', /* Bold */
          color: '#080B12',
          textAlign: 'center',
        }}
      >
        {formatCurrency(amount)}
      </div>
    </div>
  )
}
