import { supabase } from '@/lib/supabase'
import { CreditCard, BankAccount } from '@/types'

/**
 * Service para operações CRUD de Accounts (Contas Bancárias e Cartões)
 * Unifica operações para ambos os tipos
 */
export const accountService = {
  /**
   * Lista todas as contas do usuário (bancárias e cartões)
   */
  async getAll() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (error) throw error

    const bankAccounts: BankAccount[] = []
    const creditCards: CreditCard[] = []

    for (const item of data || []) {
      if (item.type === 'CREDIT_CARD') {
        creditCards.push({
          id: item.id,
          name: item.name,
          bank: item.bank,
          holderId: item.holder_id,
          limit: Number(item.credit_limit || 0),
          currentBill: Number(item.current_bill || 0),
          closingDay: item.closing_day || 1,
          dueDay: item.due_day || 1,
          lastDigits: item.last_digits || undefined,
          theme: (item.theme as 'black' | 'lime' | 'white') || 'black',
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at),
        })
      } else {
        bankAccounts.push({
          id: item.id,
          name: item.name,
          bank: item.bank,
          holderId: item.holder_id,
          balance: Number(item.balance || 0),
          accountType: item.type.toLowerCase(),
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at),
        })
      }
    }

    return { bankAccounts, creditCards }
  },

  /**
   * Cria uma conta bancária
   */
  async createBankAccount(
    account: Omit<BankAccount, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<BankAccount> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('accounts')
      .insert({
        user_id: user.id,
        type: 'CHECKING', // Default, pode ser ajustado
        name: account.name,
        bank: account.bank,
        holder_id: account.holderId,
        balance: account.balance || 0,
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      bank: data.bank,
      holderId: data.holder_id,
      balance: Number(data.balance || 0),
      accountType: data.type.toLowerCase(),
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  },

  /**
   * Cria um cartão de crédito
   */
  async createCreditCard(
    card: Omit<CreditCard, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<CreditCard> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('accounts')
      .insert({
        user_id: user.id,
        type: 'CREDIT_CARD',
        name: card.name,
        bank: card.bank,
        holder_id: card.holderId,
        credit_limit: card.limit,
        current_bill: card.currentBill || 0,
        closing_day: card.closingDay,
        due_day: card.dueDay,
        last_digits: card.lastDigits || null,
        theme: card.theme || 'black',
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      bank: data.bank,
      holderId: data.holder_id,
      limit: Number(data.credit_limit || 0),
      currentBill: Number(data.current_bill || 0),
      closingDay: data.closing_day || 1,
      dueDay: data.due_day || 1,
      lastDigits: data.last_digits || undefined,
      theme: (data.theme as 'black' | 'lime' | 'white') || 'black',
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  },

  /**
   * Atualiza uma conta bancária
   */
  async updateBankAccount(
    id: string,
    updates: Partial<Omit<BankAccount, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<BankAccount> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('User not authenticated')

    const updateData: Record<string, unknown> = {}
    if (updates.name !== undefined) updateData.name = updates.name
    if (updates.bank !== undefined) updateData.bank = updates.bank
    if (updates.balance !== undefined) updateData.balance = updates.balance
    if (updates.holderId !== undefined) updateData.holder_id = updates.holderId

    const { data, error } = await supabase
      .from('accounts')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      bank: data.bank,
      holderId: data.holder_id,
      balance: Number(data.balance || 0),
      accountType: data.type.toLowerCase(),
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  },

  /**
   * Atualiza um cartão de crédito
   */
  async updateCreditCard(
    id: string,
    updates: Partial<Omit<CreditCard, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<CreditCard> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('User not authenticated')

    const updateData: Record<string, unknown> = {}
    if (updates.name !== undefined) updateData.name = updates.name
    if (updates.bank !== undefined) updateData.bank = updates.bank
    if (updates.limit !== undefined) updateData.credit_limit = updates.limit
    if (updates.currentBill !== undefined)
      updateData.current_bill = updates.currentBill
    if (updates.closingDay !== undefined)
      updateData.closing_day = updates.closingDay
    if (updates.dueDay !== undefined) updateData.due_day = updates.dueDay
    if (updates.lastDigits !== undefined)
      updateData.last_digits = updates.lastDigits || null
    if (updates.theme !== undefined) updateData.theme = updates.theme
    if (updates.holderId !== undefined) updateData.holder_id = updates.holderId

    const { data, error } = await supabase
      .from('accounts')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      bank: data.bank,
      holderId: data.holder_id,
      limit: Number(data.credit_limit || 0),
      currentBill: Number(data.current_bill || 0),
      closingDay: data.closing_day || 1,
      dueDay: data.due_day || 1,
      lastDigits: data.last_digits || undefined,
      theme: (data.theme as 'black' | 'lime' | 'white') || 'black',
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  },

  /**
   * Deleta uma conta ou cartão
   */
  async delete(id: string): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  },
}
