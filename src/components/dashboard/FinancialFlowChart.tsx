import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/utils/formatters'

/**
 * FinancialFlowChart - Gráfico de área de evolução de receitas e despesas
 * 
 * Valores do Figma:
 * - Título: fontSize 20px, fontWeight 700, lineHeight 28px
 * - Legenda: círculo 9px, texto fontSize 12px, fontWeight 600, lineHeight 16px
 * - Receitas: verde #C4E703 (Figma) ou #D7FF00 (padrão projeto)
 * - Despesas: vermelho #E61E32 (Figma)
 * - Altura do gráfico: 300px
 */

interface ChartDataPoint {
  month: string
  receitas: number
  despesas: number
}

// Dados mock temporários - estrutura pronta para receber dados reais
const mockData: ChartDataPoint[] = [
  { month: 'Jan', receitas: 2000, despesas: 1000 },
  { month: 'Fev', receitas: 5000, despesas: 3000 },
  { month: 'Mar', receitas: 10500, despesas: 6000 },
  { month: 'Abr', receitas: 11000, despesas: 7500 },
  { month: 'Mai', receitas: 8500, despesas: 8500 },
  { month: 'Jun', receitas: 6500, despesas: 7000 },
  { month: 'Jul', receitas: 6000, despesas: 6500 },
  { month: 'Ago', receitas: 7000, despesas: 5000 },
  { month: 'Set', receitas: 9000, despesas: 4500 },
  { month: 'Out', receitas: 10000, despesas: 4000 },
  { month: 'Nov', receitas: 11500, despesas: 5500 },
  { month: 'Dez', receitas: 12500, despesas: 6000 },
]

// Formatação compacta para valores monetários (R$ 2k, R$ 4k, etc)
const formatCompactCurrency = (value: number): string => {
  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(0)}k`
  }
  return formatCurrency(value)
}

// Tooltip customizado
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const receitasValue = payload.find((p: any) => p.dataKey === 'receitas')?.value || 0
    const despesasValue = payload.find((p: any) => p.dataKey === 'despesas')?.value || 0

    return (
      <div
        style={{
          padding: '12px',
          borderRadius: '12px',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
          border: '1px solid #E5E7EB',
        }}
      >
        <p
          style={{
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '700',
            color: '#080B12',
          }}
        >
          {label}
        </p>
        <p
          style={{
            marginBottom: '4px',
            fontSize: '14px',
            color: '#22C55E', /* Verde escuro para receitas */
          }}
        >
          Receitas: {formatCurrency(receitasValue)}
        </p>
        <p
          style={{
            fontSize: '14px',
            color: '#080B12', /* Preto para despesas */
          }}
        >
          Despesas: {formatCurrency(despesasValue)}
        </p>
      </div>
    )
  }
  return null
}

export function FinancialFlowChart() {
  return (
    <div
      style={{
        borderRadius: '20px', /* Corner radius do Figma */
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        padding: '24px', /* Padding do Figma */
      }}
    >
      {/* Header: Título e Legenda */}
      <div
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
        style={{
          marginBottom: 'var(--spacing-lg)',
          gap: 'var(--spacing-md)',
        }}
      >
        {/* Título com ícone */}
        <div className="flex items-center gap-2" style={{ gap: '8px' /* itemSpacing do Figma */ }}>
          {/* Ícone de gráfico crescente */}
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
              d="M3 13l4-4 4 4M3 21V5a2 2 0 012-2h14a2 2 0 012 2v16M7 13h14"
            />
          </svg>
          <h2
            style={{
              fontSize: '20px', /* Font size exato do Figma */
              fontWeight: '700', /* Bold do Figma */
              lineHeight: '28px', /* Line height exato do Figma */
              color: '#080B12',
            }}
          >
            Fluxo financeiro
          </h2>
        </div>

        {/* Legenda */}
        <div className="flex items-center gap-4" style={{ gap: '16px' }}>
          {/* Legenda Receitas */}
          <div className="flex items-center gap-2" style={{ gap: '8px' }}>
            <div
              style={{
                width: '9px', /* Diâmetro do círculo do Figma */
                height: '9px',
                borderRadius: '50%',
                backgroundColor: '#D7FF00', /* Verde-limão */
              }}
            />
            <span
              style={{
                fontSize: '12px', /* Font size exato do Figma */
                fontWeight: '600', /* Semibold do Figma */
                lineHeight: '16px', /* Line height exato do Figma */
                color: '#080B12',
              }}
            >
              Receitas
            </span>
          </div>

          {/* Legenda Despesas */}
          <div className="flex items-center gap-2" style={{ gap: '8px' }}>
            <div
              style={{
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                backgroundColor: '#E61E32', /* Vermelho do Figma para despesas */
              }}
            />
            <span
              style={{
                fontSize: '12px',
                fontWeight: '600',
                lineHeight: '16px',
                color: '#080B12',
              }}
            >
              Despesas
            </span>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={mockData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            {/* Gradiente para Receitas (verde-limão 30% opaco -> transparente) */}
            <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D7FF00" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#D7FF00" stopOpacity={0} />
            </linearGradient>
            {/* Gradiente para Despesas (preto 10% opaco -> transparente) */}
            <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#080B12" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#080B12" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Grid horizontal tracejado sutil */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#F3F4F6" /* Cinza claríssimo */
            horizontal={true}
            vertical={false}
          />

          {/* Eixo X - Meses */}
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 12,
              fill: '#525252', /* Cinza médio */
            }}
            style={{ fontSize: '12px' }}
          />

          {/* Eixo Y - Valores monetários compactos */}
          <YAxis
            axisLine={false}
            tickLine={false}
            tickFormatter={formatCompactCurrency}
            tick={{
              fontSize: 12,
              fill: '#525252', /* Cinza médio */
            }}
            width={60}
          />

          {/* Tooltip customizado */}
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }} />

          {/* Área de Receitas */}
          <Area
            type="monotone"
            dataKey="receitas"
            stroke="#D7FF00" /* Verde-limão */
            strokeWidth={3} /* 3 pixels de espessura */
            fill="url(#colorReceitas)" /* Gradiente */
            dot={false}
            activeDot={{ r: 4 }}
          />

          {/* Área de Despesas */}
          <Area
            type="monotone"
            dataKey="despesas"
            stroke="#E61E32" /* Vermelho do Figma */
            strokeWidth={3} /* 3 pixels de espessura */
            fill="url(#colorDespesas)" /* Gradiente */
            dot={false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
