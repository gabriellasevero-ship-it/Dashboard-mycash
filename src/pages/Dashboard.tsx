import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

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

        {/* Conteúdo do dashboard será implementado nos próximos prompts */}
        <div
          className="w-full"
          style={{
            paddingBottom: 'var(--spacing-xl)',
          }}
        >
          <h1 className="text-2xl font-bold text-text-primary py-8">
            Dashboard
          </h1>
          <p className="text-text-secondary">
            Cards de métricas e gráficos serão implementados nos próximos prompts
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
