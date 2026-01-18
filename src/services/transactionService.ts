import { supabase } from '@/lib/supabase'
import { Transaction, TransactionType } from '@/types'

/**
 * Service para operações CRUD de Transactions
 */
export const transactionService = {
  /**
   * Lista todas as transações do usuário
   */
  async getAll(): Promise<Transaction[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('transactions')
      .select('*, category:categories(name)')
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (error) throw error

    return (data || []).map((item: any) => ({
      id: item.id,
      type: (item.type.toLowerCase() as TransactionType),
      amount: Number(item.amount || 0),
      description: item.description,
      category: item.category?.name || item.category_name || 'Sem categoria',
      date: new Date(item.date),
      accountId: item.account_id || null,
      memberId: item.member_id || null,
      installments: item.total_installments || 1,
      currentInstallment: item.installment_number || undefined,
      status: item.status === 'PENDING' ? 'pending' : 'completed',
      isRecurring: item.is_recurring || false,
      isPaid: item.status === 'COMPLETED',
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at),
    }))
  },

  /**
   * Cria uma nova transação
   */
  async create(
    transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Transaction> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('User not authenticated')

    // Buscar category_id pelo nome (ou usar ID se for UUID)
    let categoryId: string | null = null
    if (transaction.category) {
      // Se category é um ID UUID, usar diretamente
      if (transaction.category.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        categoryId = transaction.category
      } else {
        // Buscar categoria pelo nome
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('user_id', user.id)
          .eq('name', transaction.category)
          .eq('type', transaction.type.toUpperCase())
          .single()

        categoryId = category?.id || null
      }
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: transaction.type.toUpperCase(),
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.date.toISOString().split('T')[0],
        category_id: categoryId,
        account_id: transaction.accountId || null,
        member_id: transaction.memberId || null,
        total_installments: transaction.installments || 1,
        installment_number: transaction.currentInstallment || (transaction.installments && transaction.installments > 1 ? 1 : null),
        is_recurring: transaction.isRecurring || false,
        status: transaction.status === 'pending' ? 'PENDING' : 'COMPLETED',
      })
      .select()
      .single()

    if (error) throw error

    // Se for parcelado, criar transações filhas (futuro: implementar lógica completa)
    // Por enquanto, apenas a primeira parcela é criada

    return {
      id: data.id,
      type: (data.type.toLowerCase() as TransactionType),
      amount: Number(data.amount || 0),
      description: data.description,
      category: transaction.category, // Manter nome original
      date: new Date(data.date),
      accountId: data.account_id || null,
      memberId: data.member_id || null,
      installments: data.total_installments || 1,
      currentInstallment: data.installment_number || undefined,
      status: data.status === 'PENDING' ? 'pending' : 'completed',
      isRecurring: data.is_recurring || false,
      isPaid: data.status === 'COMPLETED',
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  },

  /**
   * Atualiza uma transação
   */
  async update(
    id: string,
    updates: Partial<Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Transaction> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('User not authenticated')

    const updateData: Record<string, unknown> = {}

    if (updates.type !== undefined)
      updateData.type = updates.type.toUpperCase()
    if (updates.amount !== undefined) updateData.amount = updates.amount
    if (updates.description !== undefined)
      updateData.description = updates.description
    if (updates.date !== undefined)
      updateData.date = updates.date.toISOString().split('T')[0]
    if (updates.accountId !== undefined)
      updateData.account_id = updates.accountId || null
    if (updates.memberId !== undefined)
      updateData.member_id = updates.memberId || null
    if (updates.status !== undefined)
      updateData.status = updates.status === 'pending' ? 'PENDING' : 'COMPLETED'
    if (updates.isRecurring !== undefined)
      updateData.is_recurring = updates.isRecurring

    const { data, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    // Retornar transação atualizada (buscar category name se necessário)
    return {
      id: data.id,
      type: (data.type.toLowerCase() as TransactionType),
      amount: Number(data.amount || 0),
      description: data.description,
      category: updates.category || 'Sem categoria', // Manter ou buscar
      date: new Date(data.date),
      accountId: data.account_id || null,
      memberId: data.member_id || null,
      installments: data.total_installments || 1,
      currentInstallment: data.installment_number || undefined,
      status: data.status === 'PENDING' ? 'pending' : 'completed',
      isRecurring: data.is_recurring || false,
      isPaid: data.status === 'COMPLETED',
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  },

  /**
   * Deleta uma transação
   */
  async delete(id: string): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  },
}
