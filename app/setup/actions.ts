'use server'

import { createClient } from '@/lib/supabase/server'

export async function setupMasterAccount(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string

  if (!email || !password || !fullName) {
    return { error: 'Semua field harus diisi' }
  }

  const supabase = await createClient()

  console.log('[v0] Starting master account setup for:', email)

  // 1. Sign up user di Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (authError) {
    console.error('[v0] Auth signup error:', authError)
    return { error: `Error membuat akun: ${authError.message}` }
  }

  if (!authData.user) {
    return { error: 'Gagal membuat user' }
  }

  console.log('[v0] User created with ID:', authData.user.id)

  // 2. Buat profile dengan role master
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      email: email,
      full_name: fullName,
      role: 'master',
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

  if (profileError) {
    console.error('[v0] Profile creation error:', profileError)
    return { error: `Error membuat profile: ${profileError.message}` }
  }

  console.log('[v0] Master account setup completed successfully')

  return { success: true }
}
