import { createContext, useContext, useState, ReactNode, useMemo } from 'react'
import {
  Transaction,
  Goal,
  CreditCard,
  BankAccount,
  FamilyMember,
  TransactionFilters,
} from '@/types'

/**
 * Interface do contexto Finance
 */
interface FinanceContextType {
  // Arrays principais
  transactions: Transaction[]
  goals: Goal[]
  creditCards: CreditCard[]
  bankAccounts: BankAccount[]
  familyMembers: FamilyMember[]

  // Filtros globais
  filters: TransactionFilters
  setFilters: (filters: Partial<TransactionFilters>) => void

  // CRUD Transactions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void

  // CRUD Goals
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  deleteGoal: (id: string) => void

  // CRUD CreditCards
  addCreditCard: (card: Omit<CreditCard, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateCreditCard: (id: string, updates: Partial<CreditCard>) => void
  deleteCreditCard: (id: string) => void

  // CRUD BankAccounts
  addBankAccount: (account: Omit<BankAccount, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateBankAccount: (id: string, updates: Partial<BankAccount>) => void
  deleteBankAccount: (id: string) => void

  // CRUD FamilyMembers
  addFamilyMember: (member: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => void
  deleteFamilyMember: (id: string) => void

  // Funções de cálculo
  getFilteredTransactions: () => Transaction[]
  calculateTotalBalance: () => number
  calculateIncomeForPeriod: () => number
  calculateExpensesForPeriod: () => number
  calculateExpensesByCategory: () => Array<{ category: string; amount: number; count: number }>
  calculateCategoryPercentage: () => Array<{ category: string; amount: number; percentage: number }>
  calculateSavingsRate: () => number
}

/**
 * Context criado
 */
const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

/**
 * Função auxiliar para gerar ID único
 */
function generateId(): string {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Função auxiliar para criar data
 */
function createDate(daysAgo: number = 0): Date {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date
}

/**
 * Dados mock iniciais - família brasileira realista
 */
function getInitialData() {
  const now = new Date()
  const threeMonthsAgo = new Date()
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

  // Membros da família
  const familyMembers: FamilyMember[] = [
    {
      id: 'member_1',
      name: 'Lucas Marte',
      role: 'Pai',
      email: 'lucasmarte@gmail.com',
      monthlyIncome: 15000,
      createdAt: createDate(365),
      updatedAt: createDate(365),
    },
    {
      id: 'member_2',
      name: 'Ana Marte',
      role: 'Mãe',
      email: 'anamarte@gmail.com',
      monthlyIncome: 12000,
      createdAt: createDate(365),
      updatedAt: createDate(365),
    },
    {
      id: 'member_3',
      name: 'Pedro Marte',
      role: 'Filho',
      email: 'pedromarte@gmail.com',
      monthlyIncome: 0,
      createdAt: createDate(365),
      updatedAt: createDate(365),
    },
  ]

  // Contas bancárias
  const bankAccounts: BankAccount[] = [
    {
      id: 'account_1',
      name: 'Conta Corrente',
      bank: 'Itaú',
      holderId: 'member_1',
      balance: 12500.50,
      accountType: 'corrente',
      accountNumber: '12345-6',
      agency: '1234',
      createdAt: createDate(730),
      updatedAt: now,
    },
    {
      id: 'account_2',
      name: 'Poupança',
      bank: 'Bradesco',
      holderId: 'member_2',
      balance: 8500.00,
      accountType: 'poupança',
      createdAt: createDate(730),
      updatedAt: now,
    },
    {
      id: 'account_3',
      name: 'Conta Conjunta',
      bank: 'Nubank',
      holderId: 'member_1',
      balance: 3200.75,
      accountType: 'corrente',
      createdAt: createDate(180),
      updatedAt: now,
    },
  ]

  // Cartões de crédito
  const creditCards: CreditCard[] = [
    {
      id: 'card_1',
      name: 'Cartão Black',
      bank: 'Nubank',
      holderId: 'member_1',
      limit: 10000,
      currentBill: 3500.00,
      closingDay: 10,
      dueDay: 17,
      lastDigits: '1234',
      theme: 'black',
      createdAt: createDate(365),
      updatedAt: now,
    },
    {
      id: 'card_2',
      name: 'Cartão Lime',
      bank: 'Inter',
      holderId: 'member_2',
      limit: 8000,
      currentBill: 2200.50,
      closingDay: 5,
      dueDay: 12,
      lastDigits: '5678',
      theme: 'lime',
      createdAt: createDate(180),
      updatedAt: now,
    },
    {
      id: 'card_3',
      name: 'Cartão Itaú',
      bank: 'Itaú',
      holderId: 'member_1',
      limit: 15000,
      currentBill: 7800.00,
      closingDay: 15,
      dueDay: 22,
      lastDigits: '9012',
      theme: 'white',
      createdAt: createDate(730),
      updatedAt: now,
    },
  ]

  // Transações (últimos 3 meses)
  const transactions: Transaction[] = [
    // Receitas
    {
      id: 'trans_1',
      type: 'income',
      amount: 15000,
      description: 'Salário - Lucas',
      category: 'Salário',
      date: createDate(5),
      accountId: 'account_1',
      memberId: 'member_1',
      status: 'completed',
      createdAt: createDate(5),
      updatedAt: createDate(5),
    },
    {
      id: 'trans_2',
      type: 'income',
      amount: 12000,
      description: 'Salário - Ana',
      category: 'Salário',
      date: createDate(5),
      accountId: 'account_2',
      memberId: 'member_2',
      status: 'completed',
      createdAt: createDate(5),
      updatedAt: createDate(5),
    },
    {
      id: 'trans_3',
      type: 'income',
      amount: 3500,
      description: 'Freelance - Projeto Web',
      category: 'Freelance',
      date: createDate(15),
      accountId: 'account_1',
      memberId: 'member_1',
      status: 'completed',
      createdAt: createDate(15),
      updatedAt: createDate(15),
    },
    // Despesas - Casa
    {
      id: 'trans_4',
      type: 'expense',
      amount: 2500,
      description: 'Aluguel',
      category: 'Moradia',
      date: createDate(3),
      accountId: 'account_1',
      memberId: null,
      status: 'completed',
      isRecurring: true,
      isPaid: true,
      createdAt: createDate(3),
      updatedAt: createDate(3),
    },
    {
      id: 'trans_5',
      type: 'expense',
      amount: 800,
      description: 'Conta de Luz',
      category: 'Moradia',
      date: createDate(10),
      accountId: 'card_1',
      memberId: null,
      status: 'completed',
      isRecurring: true,
      isPaid: true,
      createdAt: createDate(10),
      updatedAt: createDate(10),
    },
    {
      id: 'trans_6',
      type: 'expense',
      amount: 350,
      description: 'Conta de Água',
      category: 'Moradia',
      date: createDate(12),
      accountId: 'account_1',
      memberId: null,
      status: 'completed',
      isRecurring: true,
      isPaid: true,
      createdAt: createDate(12),
      updatedAt: createDate(12),
    },
    {
      id: 'trans_7',
      type: 'expense',
      amount: 450,
      description: 'Internet e Telefone',
      category: 'Moradia',
      date: createDate(8),
      accountId: 'card_1',
      memberId: null,
      status: 'completed',
      isRecurring: true,
      isPaid: true,
      createdAt: createDate(8),
      updatedAt: createDate(8),
    },
    // Despesas - Alimentação
    {
      id: 'trans_8',
      type: 'expense',
      amount: 1200,
      description: 'Supermercado - Semanal',
      category: 'Alimentação',
      date: createDate(2),
      accountId: 'card_1',
      memberId: null,
      status: 'completed',
      isRecurring: true,
      isPaid: true,
      createdAt: createDate(2),
      updatedAt: createDate(2),
    },
    {
      id: 'trans_9',
      type: 'expense',
      amount: 350,
      description: 'Restaurante - Aniversário',
      category: 'Alimentação',
      date: createDate(7),
      accountId: 'card_2',
      memberId: null,
      status: 'completed',
      isPaid: true,
      createdAt: createDate(7),
      updatedAt: createDate(7),
    },
    {
      id: 'trans_10',
      type: 'expense',
      amount: 180,
      description: 'Delivery - Ifood',
      category: 'Alimentação',
      date: createDate(14),
      accountId: 'card_1',
      memberId: null,
      status: 'completed',
      isPaid: true,
      createdAt: createDate(14),
      updatedAt: createDate(14),
    },
    // Despesas - Transporte
    {
      id: 'trans_11',
      type: 'expense',
      amount: 600,
      description: 'Combustível - Mês',
      category: 'Transporte',
      date: createDate(1),
      accountId: 'card_1',
      memberId: 'member_1',
      status: 'completed',
      isRecurring: true,
      isPaid: true,
      createdAt: createDate(1),
      updatedAt: createDate(1),
    },
    {
      id: 'trans_12',
      type: 'expense',
      amount: 150,
      description: 'Uber - Volta do trabalho',
      category: 'Transporte',
      date: createDate(16),
      accountId: 'card_2',
      memberId: 'member_2',
      status: 'completed',
      isPaid: true,
      createdAt: createDate(16),
      updatedAt: createDate(16),
    },
    {
      id: 'trans_13',
      type: 'expense',
      amount: 450,
      description: 'Estacionamento - Mensal',
      category: 'Transporte',
      date: createDate(20),
      accountId: 'account_1',
      memberId: 'member_1',
      status: 'completed',
      isRecurring: true,
      isPaid: true,
      createdAt: createDate(20),
      updatedAt: createDate(20),
    },
    // Despesas - Saúde
    {
      id: 'trans_14',
      type: 'expense',
      amount: 1200,
      description: 'Plano de Saúde - Família',
      category: 'Saúde',
      date: createDate(1),
      accountId: 'account_1',
      memberId: null,
      status: 'completed',
      isRecurring: true,
      isPaid: true,
      createdAt: createDate(1),
      updatedAt: createDate(1),
    },
    {
      id: 'trans_15',
      type: 'expense',
      amount: 350,
      description: 'Consulta Médica',
      category: 'Saúde',
      date: createDate(25),
      accountId: 'card_2',
      memberId: 'member_3',
      status: 'completed',
      isPaid: true,
      createdAt: createDate(25),
      updatedAt: createDate(25),
    },
    {
      id: 'trans_16',
      type: 'expense',
      amount: 180,
      description: 'Farmácia - Remédios',
      category: 'Saúde',
      date: createDate(30),
      accountId: 'card_1',
      memberId: null,
      status: 'completed',
      isPaid: true,
      createdAt: createDate(30),
      updatedAt: createDate(30),
    },
    // Despesas - Educação
    {
      id: 'trans_17',
      type: 'expense',
      amount: 1800,
      description: 'Mensalidade Escolar - Pedro',
      category: 'Educação',
      date: createDate(5),
      accountId: 'account_1',
      memberId: 'member_3',
      status: 'completed',
      isRecurring: true,
      isPaid: true,
      createdAt: createDate(5),
      updatedAt: createDate(5),
    },
    {
      id: 'trans_18',
      type: 'expense',
      amount: 600,
      description: 'Curso de Inglês',
      category: 'Educação',
      date: createDate(12),
      accountId: 'card_1',
      memberId: 'member_1',
      status: 'completed',
      isRecurring: true,
      isPaid: true,
      createdAt: createDate(12),
      updatedAt: createDate(12),
    },
    // Despesas - Lazer
    {
      id: 'trans_19',
      type: 'expense',
      amount: 500,
      description: 'Cinema - Família',
      category: 'Lazer',
      date: createDate(18),
      accountId: 'card_2',
      memberId: null,
      status: 'completed',
      isPaid: true,
      createdAt: createDate(18),
      updatedAt: createDate(18),
    },
    {
      id: 'trans_20',
      type: 'expense',
      amount: 1200,
      description: 'Viagem - Fim de Semana',
      category: 'Lazer',
      date: createDate(45),
      accountId: 'card_1',
      memberId: null,
      status: 'completed',
      isPaid: true,
      createdAt: createDate(45),
      updatedAt: createDate(45),
    },
    // Despesas - Outras
    {
      id: 'trans_21',
      type: 'expense',
      amount: 300,
      description: 'Roupas - Ana',
      category: 'Vestuário',
      date: createDate(22),
      accountId: 'card_2',
      memberId: 'member_2',
      status: 'completed',
      isPaid: true,
      createdAt: createDate(22),
      updatedAt: createDate(22),
    },
    {
      id: 'trans_22',
      type: 'expense',
      amount: 250,
      description: 'Livros - Pedro',
      category: 'Educação',
      date: createDate(28),
      accountId: 'card_1',
      memberId: 'member_3',
      status: 'completed',
      isPaid: true,
      createdAt: createDate(28),
      updatedAt: createDate(28),
    },
    {
      id: 'trans_23',
      type: 'expense',
      amount: 400,
      description: 'Presente - Aniversário',
      category: 'Outros',
      date: createDate(35),
      accountId: 'card_2',
      memberId: null,
      status: 'completed',
      isPaid: true,
      createdAt: createDate(35),
      updatedAt: createDate(35),
    },
    {
      id: 'trans_24',
      type: 'expense',
      amount: 850,
      description: 'Manutenção do Carro',
      category: 'Transporte',
      date: createDate(50),
      accountId: 'card_1',
      memberId: 'member_1',
      status: 'completed',
      isPaid: true,
      createdAt: createDate(50),
      updatedAt: createDate(50),
    },
    {
      id: 'trans_25',
      type: 'expense',
      amount: 1200,
      description: 'Supermercado - Quinzenal',
      category: 'Alimentação',
      date: createDate(40),
      accountId: 'card_1',
      memberId: null,
      status: 'completed',
      isRecurring: true,
      isPaid: true,
      createdAt: createDate(40),
      updatedAt: createDate(40),
    },
    {
      id: 'trans_26',
      type: 'expense',
      amount: 1500,
      description: 'Faculdade - Mensalidade',
      category: 'Educação',
      date: createDate(60),
      accountId: 'account_1',
      memberId: 'member_1',
      status: 'completed',
      isRecurring: true,
      isPaid: true,
      createdAt: createDate(60),
      updatedAt: createDate(60),
    },
    {
      id: 'trans_27',
      type: 'expense',
      amount: 280,
      description: 'Netflix, Spotify, Amazon Prime',
      category: 'Lazer',
      date: createDate(65),
      accountId: 'card_1',
      memberId: null,
      status: 'completed',
      isRecurring: true,
      isPaid: true,
      createdAt: createDate(65),
      updatedAt: createDate(65),
    },
    {
      id: 'trans_28',
      type: 'expense',
      amount: 320,
      description: 'Academia',
      category: 'Saúde',
      date: createDate(70),
      accountId: 'card_1',
      memberId: 'member_1',
      status: 'completed',
      isRecurring: true,
      isPaid: true,
      createdAt: createDate(70),
      updatedAt: createDate(70),
    },
    {
      id: 'trans_29',
      type: 'expense',
      amount: 150,
      description: 'Farmácia',
      category: 'Saúde',
      date: createDate(75),
      accountId: 'card_2',
      memberId: null,
      status: 'completed',
      isPaid: true,
      createdAt: createDate(75),
      updatedAt: createDate(75),
    },
    {
      id: 'trans_30',
      type: 'expense',
      amount: 2500,
      description: 'Aluguel',
      category: 'Moradia',
      date: createDate(33),
      accountId: 'account_1',
      memberId: null,
      status: 'completed',
      isRecurring: true,
      isPaid: true,
      createdAt: createDate(33),
      updatedAt: createDate(33),
    },
  ]

  // Objetivos financeiros
  const goals: Goal[] = [
    {
      id: 'goal_1',
      title: 'Reserva de Emergência',
      description: '6 meses de despesas',
      targetAmount: 50000,
      currentAmount: 24200.25,
      deadline: createDate(-180),
      category: 'Reserva',
      memberId: null,
      isCompleted: false,
      createdAt: createDate(365),
      updatedAt: now,
    },
    {
      id: 'goal_2',
      title: 'Viagem para Europa',
      description: 'Passagens e hospedagem',
      targetAmount: 25000,
      currentAmount: 8500.00,
      deadline: createDate(-270),
      category: 'Viagem',
      memberId: null,
      isCompleted: false,
      createdAt: createDate(180),
      updatedAt: now,
    },
    {
      id: 'goal_3',
      title: 'Novo Notebook',
      description: 'MacBook Pro para trabalho',
      targetAmount: 15000,
      currentAmount: 15000,
      deadline: createDate(-30),
      category: 'Trabalho',
      memberId: 'member_1',
      isCompleted: true,
      createdAt: createDate(90),
      updatedAt: now,
    },
    {
      id: 'goal_4',
      title: 'Investimento em Renda Fixa',
      description: 'CDB 12 meses',
      targetAmount: 100000,
      currentAmount: 35000.00,
      deadline: createDate(-360),
      category: 'Investimento',
      memberId: null,
      isCompleted: false,
      createdAt: createDate(730),
      updatedAt: now,
    },
  ]

  return {
    familyMembers,
    bankAccounts,
    creditCards,
    transactions,
    goals,
  }
}

/**
 * Provider do contexto Finance
 */
export function FinanceProvider({ children }: { children: ReactNode }) {
  const initialData = useMemo(() => getInitialData(), [])

  // Estados dos arrays principais
  const [transactions, setTransactions] = useState<Transaction[]>(initialData.transactions)
  const [goals, setGoals] = useState<Goal[]>(initialData.goals)
  const [creditCards, setCreditCards] = useState<CreditCard[]>(initialData.creditCards)
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(initialData.bankAccounts)
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialData.familyMembers)

  // Estados dos filtros
  const [filters, setFiltersState] = useState<TransactionFilters>({
    selectedMember: null,
    dateRange: {
      startDate: null,
      endDate: null,
    },
    transactionType: 'all',
    searchText: '',
  })

  // Função para atualizar filtros
  const setFilters = (newFilters: Partial<TransactionFilters>) => {
    setFiltersState((prev) => ({
      ...prev,
      ...newFilters,
      dateRange: {
        ...prev.dateRange,
        ...(newFilters.dateRange || {}),
      },
    }))
  }

  // ============================================
  // CRUD Transactions
  // ============================================
  const addTransaction = (
    transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const now = new Date()
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    setTransactions((prev) => [...prev, newTransaction])
  }

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
      )
    )
  }

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  // ============================================
  // CRUD Goals
  // ============================================
  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date()
    const newGoal: Goal = {
      ...goal,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    setGoals((prev) => [...prev, newGoal])
  }

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, ...updates, updatedAt: new Date() } : g
      )
    )
  }

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id))
  }

  // ============================================
  // CRUD CreditCards
  // ============================================
  const addCreditCard = (
    card: Omit<CreditCard, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const now = new Date()
    const newCard: CreditCard = {
      ...card,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    setCreditCards((prev) => [...prev, newCard])
  }

  const updateCreditCard = (id: string, updates: Partial<CreditCard>) => {
    setCreditCards((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
      )
    )
  }

  const deleteCreditCard = (id: string) => {
    setCreditCards((prev) => prev.filter((c) => c.id !== id))
  }

  // ============================================
  // CRUD BankAccounts
  // ============================================
  const addBankAccount = (
    account: Omit<BankAccount, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const now = new Date()
    const newAccount: BankAccount = {
      ...account,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    setBankAccounts((prev) => [...prev, newAccount])
  }

  const updateBankAccount = (id: string, updates: Partial<BankAccount>) => {
    setBankAccounts((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, ...updates, updatedAt: new Date() } : a
      )
    )
  }

  const deleteBankAccount = (id: string) => {
    setBankAccounts((prev) => prev.filter((a) => a.id !== id))
  }

  // ============================================
  // CRUD FamilyMembers
  // ============================================
  const addFamilyMember = (
    member: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const now = new Date()
    const newMember: FamilyMember = {
      ...member,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    setFamilyMembers((prev) => [...prev, newMember])
  }

  const updateFamilyMember = (id: string, updates: Partial<FamilyMember>) => {
    setFamilyMembers((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, ...updates, updatedAt: new Date() } : m
      )
    )
  }

  const deleteFamilyMember = (id: string) => {
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id))
  }

  // ============================================
  // Funções de Cálculo
  // ============================================

  /**
   * Retorna transações filtradas aplicando todos os filtros ativos
   */
  const getFilteredTransactions = useMemo(() => {
    return () => {
      let filtered = [...transactions]

      // Filtro por membro
      if (filters.selectedMember) {
        filtered = filtered.filter((t) => t.memberId === filters.selectedMember)
      }

      // Filtro por tipo
      if (filters.transactionType !== 'all') {
        filtered = filtered.filter((t) => t.type === filters.transactionType)
      }

      // Filtro por data
      if (filters.dateRange.startDate) {
        filtered = filtered.filter(
          (t) => new Date(t.date) >= filters.dateRange.startDate!
        )
      }
      if (filters.dateRange.endDate) {
        filtered = filtered.filter(
          (t) => new Date(t.date) <= filters.dateRange.endDate!
        )
      }

      // Filtro por texto de busca
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase()
        filtered = filtered.filter(
          (t) =>
            t.description.toLowerCase().includes(searchLower) ||
            t.category.toLowerCase().includes(searchLower)
        )
      }

      return filtered
    }
  }, [transactions, filters])

  /**
   * Calcula saldo total (saldos de contas - faturas de cartões)
   */
  const calculateTotalBalance = useMemo(() => {
    return () => {
      const accountsBalance = bankAccounts.reduce((sum, acc) => sum + acc.balance, 0)
      const cardsBills = creditCards.reduce((sum, card) => sum + card.currentBill, 0)
      return accountsBalance - cardsBills
    }
  }, [bankAccounts, creditCards])

  /**
   * Calcula receitas do período filtrado
   */
  const calculateIncomeForPeriod = useMemo(() => {
    return () => {
      const filtered = getFilteredTransactions()
      return filtered
        .filter((t) => t.type === 'income' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0)
    }
  }, [getFilteredTransactions])

  /**
   * Calcula despesas do período filtrado
   */
  const calculateExpensesForPeriod = useMemo(() => {
    return () => {
      const filtered = getFilteredTransactions()
      return filtered
        .filter((t) => t.type === 'expense' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0)
    }
  }, [getFilteredTransactions])

  /**
   * Agrupa despesas por categoria e retorna ordenado por valor decrescente
   */
  const calculateExpensesByCategory = useMemo(() => {
    return () => {
      const filtered = getFilteredTransactions()
      const expenses = filtered.filter((t) => t.type === 'expense' && t.status === 'completed')

      const categoryMap = new Map<string, { amount: number; count: number }>()

      expenses.forEach((t) => {
        const existing = categoryMap.get(t.category) || { amount: 0, count: 0 }
        categoryMap.set(t.category, {
          amount: existing.amount + t.amount,
          count: existing.count + 1,
        })
      })

      return Array.from(categoryMap.entries())
        .map(([category, data]) => ({ category, ...data }))
        .sort((a, b) => b.amount - a.amount)
    }
  }, [getFilteredTransactions])

  /**
   * Calcula percentual de cada categoria em relação à receita total
   */
  const calculateCategoryPercentage = useMemo(() => {
    return () => {
      const expensesByCategory = calculateExpensesByCategory()
      const totalIncome = calculateIncomeForPeriod()

      if (totalIncome === 0) return []

      return expensesByCategory.map((item) => ({
        category: item.category,
        amount: item.amount,
        percentage: (item.amount / totalIncome) * 100,
      }))
    }
  }, [calculateExpensesByCategory, calculateIncomeForPeriod])

  /**
   * Calcula taxa de poupança: (receitas - despesas) / receitas × 100
   */
  const calculateSavingsRate = useMemo(() => {
    return () => {
      const income = calculateIncomeForPeriod()
      const expenses = calculateExpensesForPeriod()

      if (income === 0) return 0

      return ((income - expenses) / income) * 100
    }
  }, [calculateIncomeForPeriod, calculateExpensesForPeriod])

  const value: FinanceContextType = {
    // Arrays
    transactions,
    goals,
    creditCards,
    bankAccounts,
    familyMembers,

    // Filtros
    filters,
    setFilters,

    // CRUD Transactions
    addTransaction,
    updateTransaction,
    deleteTransaction,

    // CRUD Goals
    addGoal,
    updateGoal,
    deleteGoal,

    // CRUD CreditCards
    addCreditCard,
    updateCreditCard,
    deleteCreditCard,

    // CRUD BankAccounts
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,

    // CRUD FamilyMembers
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,

    // Funções de cálculo
    getFilteredTransactions,
    calculateTotalBalance,
    calculateIncomeForPeriod,
    calculateExpensesForPeriod,
    calculateExpensesByCategory,
    calculateCategoryPercentage,
    calculateSavingsRate,
  }

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

/**
 * Hook customizado para acessar o contexto Finance
 */
export function useFinance() {
  const context = useContext(FinanceContext)
  if (context === undefined) {
    throw new Error('useFinance deve ser usado dentro de um FinanceProvider')
  }
  return context
}
