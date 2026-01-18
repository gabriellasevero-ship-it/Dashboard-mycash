import { BalanceCard } from './BalanceCard'
import { IncomeCard } from './IncomeCard'
import { ExpenseCard } from './ExpenseCard'

/**
 * SummaryCards - Container dos três cards de resumo
 * Organiza horizontalmente no desktop e verticalmente no mobile
 * BalanceCard pode ser um pouco maior no desktop
 */
export function SummaryCards() {
  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6"
      style={{
        width: '100%',
      }}
    >
      {/* BalanceCard - pode ser um pouco maior no desktop */}
      <div className="lg:col-span-1">
        <BalanceCard />
      </div>

      {/* IncomeCard */}
      <div className="lg:col-span-1">
        <IncomeCard />
      </div>

      {/* ExpenseCard */}
      <div className="lg:col-span-1">
        <ExpenseCard />
      </div>
    </div>
  )
}
