'use server'

import { createClient } from '@/lib/supabase/server'

export async function getAllUsers() {
  const supabase = await createClient()

  console.log('[v0] Fetching all users from profiles table')

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, role')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[v0] Error fetching users:', error)
    return { error: error.message, users: [] }
  }

  console.log('[v0] Found users:', profiles?.length || 0)

  return { users: profiles || [] }
}

export async function promoteToMaster(userId: string) {
  const supabase = await createClient()

  console.log('[v0] Promoting user to master:', userId)

  const { error } = await supabase
    .from('profiles')
    .update({ 
      role: 'master',
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)

  if (error) {
    console.error('[v0] Error promoting user:', error)
    return { error: error.message }
  }

  console.log('[v0] User promoted to master successfully')

  return { success: true }
}
