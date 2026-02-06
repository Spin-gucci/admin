import { getCurrentUser } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'
import { getDashboardRoute } from '@/lib/rbac'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Redirect to role-specific dashboard
  redirect(getDashboardRoute(user.role))
}
