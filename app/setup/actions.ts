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

  // 1. Sign up user dengan autoConfirm untuk bypass email verification
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: 'master',
      },
      emailRedirectTo: undefined, // Disable email confirmation
    },
  })

  if (authError) {
    console.error('[v0] Auth signup error:', authError)
    
    // Jika rate limit, coba login untuk cek apakah user sudah ada
    if (authError.message.includes('rate limit')) {
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (!loginError && loginData.user) {
        // User sudah ada, update role-nya
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'master', full_name: fullName })
          .eq('id', loginData.user.id)
        
        if (updateError) {
          console.error('[v0] Profile update error:', updateError)
        }
        
        return { success: true, message: 'Akun sudah ada dan berhasil diupdate ke role master' }
      }
      
      return { error: 'Rate limit tercapai. Silakan tunggu beberapa menit atau gunakan email berbeda.' }
    }
    
    return { error: `Error membuat akun: ${authError.message}` }
  }

  if (!authData.user) {
    return { error: 'Gagal membuat user' }
  }

  console.log('[v0] User created with ID:', authData.user.id)

  // Tunggu sebentar untuk trigger database
  await new Promise(resolve => setTimeout(resolve, 1000))

  // 2. Update profile dengan role master (jika trigger belum buat)
  const { error: upsertError } = await supabase
    .from('profiles')
    .upsert({
      id: authData.user.id,
      email: email,
      full_name: fullName,
      role: 'master',
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'id'
    })

  if (upsertError) {
    console.error('[v0] Profile upsert error:', upsertError)
    // Continue anyway, user sudah dibuat
  }

  console.log('[v0] Master account setup completed successfully')

  return { success: true }
}
