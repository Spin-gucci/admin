'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { isStaff, isAdminOrHigher, isMaster } from '@/lib/rbac'
import { UserRole } from '@/lib/types/database'

export async function getUsers() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated', data: [] }
  }

  // Check if user has permission (must be staff)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !isStaff(profile.role)) {
    return { error: 'Insufficient permissions', data: [] }
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return { error: error.message, data: [] }
  }

  return { data, error: null }
}

export async function getUser(userId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated', data: null }
  }

  // Check if user has permission or is viewing own profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (!isStaff(profile.role) && user.id !== userId)) {
    return { error: 'Insufficient permissions', data: null }
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    return { error: error.message, data: null }
  }

  return { data, error: null }
}

export async function updateUserRole(userId: string, role: UserRole) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Check if user has permission (must be master)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !isMaster(profile.role)) {
    return { error: 'Insufficient permissions. Only masters can change roles.' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteUser(userId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Check if user has permission (must be master)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !isMaster(profile.role)) {
    return { error: 'Insufficient permissions. Only masters can delete users.' }
  }

  // Cannot delete self
  if (user.id === userId) {
    return { error: 'Cannot delete your own account' }
  }

  // Delete from auth.users (will cascade to profiles)
  const { error } = await supabase.auth.admin.deleteUser(userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateUserBalance(userId: string, amount: number) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Check if user has permission (must be admin or higher)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !isAdminOrHigher(profile.role)) {
    return { error: 'Insufficient permissions' }
  }

  // Get current balance
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('balance')
    .eq('id', userId)
    .single()

  if (!userProfile) {
    return { error: 'User not found' }
  }

  const newBalance = userProfile.balance + amount

  if (newBalance < 0) {
    return { error: 'Insufficient balance' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ balance: newBalance })
    .eq('id', userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
