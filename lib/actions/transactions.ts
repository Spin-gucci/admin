'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { TransactionType, TransactionStatus } from '@/lib/types/database'
import { isStaff } from '@/lib/rbac'

export async function createTransaction(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const type = formData.get('type') as TransactionType
  const amount = parseFloat(formData.get('amount') as string)
  const notes = formData.get('notes') as string

  if (!type || !amount || amount <= 0) {
    return { error: 'Invalid transaction data' }
  }

  const { error } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      type,
      amount,
      notes: notes || null,
      status: 'pending',
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateTransactionStatus(
  transactionId: string,
  status: TransactionStatus,
  notes?: string
) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Check if user has permission (must be staff)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !isStaff(profile.role)) {
    return { error: 'Insufficient permissions' }
  }

  // Get transaction details
  const { data: transaction } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', transactionId)
    .single()

  if (!transaction) {
    return { error: 'Transaction not found' }
  }

  // Update transaction status
  const { error: updateError } = await supabase
    .from('transactions')
    .update({
      status,
      processed_by: user.id,
      processed_at: new Date().toISOString(),
      notes: notes || transaction.notes,
    })
    .eq('id', transactionId)

  if (updateError) {
    return { error: updateError.message }
  }

  // If approved and completed, update user balance
  if (status === 'completed') {
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', transaction.user_id)
      .single()

    if (userProfile) {
      const newBalance =
        transaction.type === 'deposit'
          ? userProfile.balance + transaction.amount
          : userProfile.balance - transaction.amount

      await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', transaction.user_id)
    }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function getTransactions(userId?: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated', data: [] }
  }

  // Get user profile to check permissions
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  let query = supabase
    .from('transactions')
    .select('*, profiles!transactions_user_id_fkey(full_name, email)')
    .order('created_at', { ascending: false })

  // If not staff, only show own transactions
  if (!profile || !isStaff(profile.role)) {
    query = query.eq('user_id', user.id)
  } else if (userId) {
    // Staff can filter by specific user
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query

  if (error) {
    return { error: error.message, data: [] }
  }

  return { data, error: null }
}

export async function deleteTransaction(transactionId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Check if user has permission (must be admin or master)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['master', 'admin'].includes(profile.role)) {
    return { error: 'Insufficient permissions' }
  }

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', transactionId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
