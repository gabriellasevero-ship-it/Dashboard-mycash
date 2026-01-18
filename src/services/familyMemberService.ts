import { supabase } from '@/lib/supabase'
import { FamilyMember } from '@/types'

/**
 * Service para operações CRUD de Family Members
 */
export const familyMemberService = {
  /**
   * Lista todos os membros da família do usuário autenticado
   */
  async getAll(): Promise<FamilyMember[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('family_members')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (error) throw error

    // Converter para formato do frontend
    return (data || []).map((item) => ({
      id: item.id,
      name: item.name,
      role: item.role,
      avatar: item.avatar_url || undefined,
      email: undefined, // Não existe no schema, manter para compatibilidade
      monthlyIncome: Number(item.monthly_income || 0),
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at),
    }))
  },

  /**
   * Busca um membro por ID
   */
  async getById(id: string): Promise<FamilyMember | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('family_members')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }

    if (!data) return null

    return {
      id: data.id,
      name: data.name,
      role: data.role,
      avatar: data.avatar_url || undefined,
      email: undefined,
      monthlyIncome: Number(data.monthly_income || 0),
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  },

  /**
   * Cria um novo membro da família
   */
  async create(
    member: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<FamilyMember> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('family_members')
      .insert({
        user_id: user.id,
        name: member.name,
        role: member.role,
        avatar_url: member.avatar || null,
        monthly_income: member.monthlyIncome || 0,
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      role: data.role,
      avatar: data.avatar_url || undefined,
      email: undefined,
      monthlyIncome: Number(data.monthly_income || 0),
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  },

  /**
   * Atualiza um membro existente
   */
  async update(
    id: string,
    updates: Partial<Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<FamilyMember> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('User not authenticated')

    const updateData: Record<string, unknown> = {}

    if (updates.name !== undefined) updateData.name = updates.name
    if (updates.role !== undefined) updateData.role = updates.role
    if (updates.avatar !== undefined) updateData.avatar_url = updates.avatar || null
    if (updates.monthlyIncome !== undefined)
      updateData.monthly_income = updates.monthlyIncome

    const { data, error } = await supabase
      .from('family_members')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      role: data.role,
      avatar: data.avatar_url || undefined,
      email: undefined,
      monthlyIncome: Number(data.monthly_income || 0),
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  },

  /**
   * Deleta um membro
   */
  async delete(id: string): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('family_members')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  },
}
