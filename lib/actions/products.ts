'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { isStaff, isAdminOrHigher } from '@/lib/rbac'

export async function createProduct(formData: FormData) {
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

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const stock = parseInt(formData.get('stock') as string)
  const category = formData.get('category') as string
  const imageUrl = formData.get('imageUrl') as string
  const isActive = formData.get('isActive') === 'true'

  if (!name || !price || price < 0 || stock < 0) {
    return { error: 'Invalid product data' }
  }

  const { error } = await supabase
    .from('products')
    .insert({
      name,
      description: description || null,
      price,
      stock: stock || 0,
      category: category || null,
      image_url: imageUrl || null,
      is_active: isActive,
      created_by: user.id,
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateProduct(productId: string, formData: FormData) {
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

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const stock = parseInt(formData.get('stock') as string)
  const category = formData.get('category') as string
  const imageUrl = formData.get('imageUrl') as string
  const isActive = formData.get('isActive') === 'true'

  const { error } = await supabase
    .from('products')
    .update({
      name,
      description: description || null,
      price,
      stock,
      category: category || null,
      image_url: imageUrl || null,
      is_active: isActive,
    })
    .eq('id', productId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteProduct(productId: string) {
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

  if (!profile || !isAdminOrHigher(profile.role)) {
    return { error: 'Insufficient permissions' }
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function getProducts(includeInactive = false) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  // If user is not staff, only show active products
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !isStaff(profile.role)) {
      query = query.eq('is_active', true)
    } else if (!includeInactive) {
      query = query.eq('is_active', true)
    }
  } else {
    // Not logged in, only show active products
    query = query.eq('is_active', true)
  }

  const { data, error } = await query

  if (error) {
    return { error: error.message, data: [] }
  }

  return { data, error: null }
}

export async function getProduct(productId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single()

  if (error) {
    return { error: error.message, data: null }
  }

  return { data, error: null }
}
