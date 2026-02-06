import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json()

    console.log('[v0] Creating master account:', email)

    // Gunakan service role untuk bypass RLS dan rate limits
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service role key
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // 1. Cek apakah user sudah ada
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers()
    const userExists = existingUser?.users?.find(u => u.email === email)

    if (userExists) {
      // Update role jika user sudah ada
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ role: 'master', full_name: fullName })
        .eq('id', userExists.id)

      if (updateError) {
        console.error('[v0] Update error:', updateError)
      }

      return NextResponse.json({ 
        success: true, 
        message: 'User sudah ada, role diupdate ke master' 
      })
    }

    // 2. Buat user baru dengan admin API (bypass rate limit!)
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto confirm email
      user_metadata: {
        full_name: fullName,
      }
    })

    if (createError) {
      console.error('[v0] Create user error:', createError)
      return NextResponse.json({ 
        error: createError.message 
      }, { status: 400 })
    }

    console.log('[v0] User created:', newUser.user?.id)

    // 3. Buat/Update profile dengan role master
    if (newUser.user) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: newUser.user.id,
          email: email,
          full_name: fullName,
          role: 'master',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

      if (profileError) {
        console.error('[v0] Profile error:', profileError)
        // Continue anyway
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Akun master berhasil dibuat!' 
    })

  } catch (error: any) {
    console.error('[v0] API error:', error)
    return NextResponse.json({ 
      error: error.message || 'Terjadi kesalahan' 
    }, { status: 500 })
  }
}
