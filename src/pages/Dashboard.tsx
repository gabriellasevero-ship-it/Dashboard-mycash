import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { ExpensesByCategoryCarousel } from '@/components/dashboard/ExpensesByCategoryCarousel'
import { FinancialFlowChart } from '@/components/dashboard/FinancialFlowChart'
import { CreditCardsWidget } from '@/components/dashboard/CreditCardsWidget'
import { UpcomingExpensesWidget } from '@/components/dashboard/UpcomingExpensesWidget'
import { TransactionsTable } from '@/components/dashboard/TransactionsTable'

/**
 * Página Dashboard - Página principal do sistema
 * Contém DashboardHeader e componentes de métricas/cards
 */
function Dashboard() {
  return (
    <div className="min-h-screen w-full bg-bg">
      <div 
        className="w-full mx-auto"
        style={{
          maxWidth: '1400px', /* Limite de largura para desktop */
          paddingLeft: 'var(--spacing-page-desktop)', /* 32px desktop */
          paddingRight: 'var(--spacing-page-desktop)',
          transition: 'padding var(--transition-slow)', /* Transição suave ao mudar sidebar */
        }}
      >
        {/* Header com controles de filtro e ação */}
        <DashboardHeader />

        {/* Grid principal: SummaryCards + Carrossel/Cartões alinhados */}
        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
          style={{
            marginTop: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-xl)',
          }}
        >
          {/* Coluna esquerda: SummaryCards e Carrossel (mesma largura) */}
          <div className="lg:col-span-2 flex flex-col gap-6 w-full">
            {/* Cards de Resumo Financeiro */}
            <div className="w-full">
              <SummaryCards />
            </div>

            {/* Carrossel de Gastos por Categoria */}
            <div className="w-full">
              <ExpensesByCategoryCarousel />
            </div>
          </div>

          {/* Coluna direita: Widget de Cartões */}
          <div className="lg:col-span-1 w-full">
            <CreditCardsWidget />
          </div>
        </div>

        {/* Layout: Gráfico Fluxo Financeiro + Widget Próximas Despesas lado a lado */}
        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
          style={{
            marginBottom: 'var(--spacing-xl)',
          }}
        >
          {/* Gráfico de Fluxo Financeiro - ocupa 2 colunas */}
          <div className="lg:col-span-2 w-full">
            <FinancialFlowChart />
          </div>

          {/* Widget de Próximas Despesas - ocupa 1 coluna */}
          <div className="lg:col-span-1 w-full">
            <UpcomingExpensesWidget />
          </div>
        </div>

        {/* Tabela de Transações Detalhada */}
        <div
          className="w-full"
          style={{
            marginBottom: 'var(--spacing-xl)',
            paddingBottom: 'var(--spacing-xl)',
          }}
        >
          <TransactionsTable />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
