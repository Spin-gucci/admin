'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { UserRole } from '@/lib/types/database'
import { getDashboardRoute } from '@/lib/rbac'

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const phone = formData.get('phone') as string
  const role = (formData.get('role') as UserRole) || 'customer'

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
        `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: {
        full_name: fullName,
        role: role,
      },
    },
  })

  if (error) {
    redirect(`/auth/sign-up?error=${encodeURIComponent(error.message)}`)
  }

  // Update profile with phone if provided
  if (data.user && phone) {
    await supabase
      .from('profiles')
      .update({ phone })
      .eq('id', data.user.id)
  }

  // Get user profile to determine role and redirect
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  revalidatePath('/', 'layout')
  
  // Redirect to appropriate dashboard based on role
  if (profile?.role) {
    const route = getDashboardRoute(profile.role)
    redirect(route)
  } else {
    redirect('/dashboard')
  }
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect(`/auth/login?error=${encodeURIComponent(error.message)}`)
  }

  // Get user profile to determine role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  if (profileError) {
    redirect('/dashboard')
  }

  revalidatePath('/', 'layout')
  
  // Redirect to appropriate dashboard based on role
  if (profile?.role) {
    const route = getDashboardRoute(profile.role)
    redirect(route)
  } else {
    redirect('/dashboard')
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/auth/login')
}

export async function getCurrentUser() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const fullName = formData.get('fullName') as string
  const phone = formData.get('phone') as string

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      phone: phone || null,
    })
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}
