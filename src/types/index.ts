/**
 * Tipos fundamentais do sistema mycash+
 * Representam as cinco entidades principais do sistema financeiro familiar
 */

/**
 * Tipo de transação financeira
 */
export type TransactionType = 'income' | 'expense';

/**
 * Status de uma transação
 */
export type TransactionStatus = 'pending' | 'completed' | 'cancelled';

/**
 * Entidade Transaction - Representa uma transação financeira
 */
export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: Date;
  accountId: string | null; // ID da conta bancária ou cartão de crédito
  memberId: string | null; // ID do membro responsável, null para família geral
  installments?: number; // Número de parcelas (1 = à vista)
  currentInstallment?: number; // Parcela atual (se parcelado)
  status: TransactionStatus;
  isRecurring?: boolean; // Indica se é despesa/receita recorrente
  isPaid?: boolean; // Indica se a transação foi paga
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Entidade Goal - Representa um objetivo financeiro
 */
export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  category?: string;
  memberId: string | null; // ID do membro responsável, null para objetivo familiar
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Tema visual do cartão de crédito
 */
export type CreditCardTheme = 'black' | 'lime' | 'white';

/**
 * Entidade CreditCard - Representa um cartão de crédito
 */
export interface CreditCard {
  id: string;
  name: string;
  bank: string;
  holderId: string; // ID do membro titular
  limit: number; // Limite total do cartão
  currentBill: number; // Fatura atual
  closingDay: number; // Dia de fechamento (1-31)
  dueDay: number; // Dia de vencimento (1-31)
  lastDigits?: string; // Últimos 4 dígitos do cartão
  theme: CreditCardTheme;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Entidade BankAccount - Representa uma conta bancária
 */
export interface BankAccount {
  id: string;
  name: string;
  bank: string;
  holderId: string; // ID do membro titular
  balance: number; // Saldo atual
  accountType?: string; // Ex: "corrente", "poupança", etc
  accountNumber?: string;
  agency?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Entidade FamilyMember - Representa um membro da família
 */
export interface FamilyMember {
  id: string;
  name: string;
  role: string; // Função na família: "Pai", "Mãe", "Filho", etc
  avatar?: string; // URL do avatar
  email?: string;
  monthlyIncome?: number; // Renda mensal estimada
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Filtros globais para transações
 */
export interface TransactionFilters {
  selectedMember: string | null;
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
  transactionType: 'all' | 'income' | 'expense';
  searchText: string;
}
