import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password, fullName, phone } = await request.json()

    // Create Supabase client
    const supabase = await createClient()

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'customer', // Will be upgraded to master via SQL
        },
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Update profile with phone if provided
    if (data.user && phone) {
      await supabase
        .from('profiles')
        .update({ phone })
        .eq('id', data.user.id)
    }

    return NextResponse.json({
      success: true,
      userId: data.user?.id,
      message: 'Account created successfully',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}
