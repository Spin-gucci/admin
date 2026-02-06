'use server'

import { createClient } from '@/lib/supabase/server'

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string

  if (!email || !password || !fullName) {
    return { error: 'Semua field harus diisi' }
  }

  const supabase = await createClient()

  console.log('[v0] Creating new account for:', email)

  // Coba sign up tanpa email confirmation
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
    
    // Handle rate limit dengan lebih baik
    if (authError.message.includes('rate limit') || authError.message.includes('Email rate limit exceeded')) {
      return { error: 'Terlalu banyak percobaan. Silakan gunakan email berbeda atau tunggu 1 jam.' }
    }
    
    if (authError.message.includes('already registered')) {
      return { error: 'Email sudah terdaftar. Silakan gunakan email lain atau login.' }
    }
    
    return { error: `Error membuat akun: ${authError.message}` }
  }

  if (!authData.user) {
    return { error: 'Gagal membuat user' }
  }

  console.log('[v0] User created successfully with ID:', authData.user.id)

  // Tunggu sebentar untuk database trigger
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Upsert profile (jika trigger belum jalan)
  const { error: upsertError } = await supabase
    .from('profiles')
    .upsert({
      id: authData.user.id,
      email: email,
      full_name: fullName,
      role: 'customer', // Default role
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'id'
    })

  if (upsertError) {
    console.error('[v0] Profile upsert error:', upsertError)
    // Continue anyway
  }

  return { success: true }
}
