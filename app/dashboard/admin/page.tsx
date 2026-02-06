import { getCurrentUser } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { StatsCard } from '@/components/dashboard/stats-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { Users, CreditCard, Package, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  if (user.role !== 'admin' && user.role !== 'master') {
    redirect('/dashboard')
  }

  const supabase = await createClient()

  // Fetch statistics
  const [usersCount, transactionsCount, productsCount, pendingCount] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('transactions').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('transactions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ])

  // Recent users
  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{'Admin Dashboard'}</h1>
            <p className="text-muted-foreground">{'Manage users, transactions, and system operations'}</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/users">{'Manage Users'}</Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Users"
            value={usersCount.count || 0}
            description="Registered users"
            icon={Users}
          />
          <StatsCard
            title="Transactions"
            value={transactionsCount.count || 0}
            description="All transactions"
            icon={CreditCard}
          />
          <StatsCard
            title="Pending Review"
            value={pendingCount.count || 0}
            description="Awaiting approval"
            icon={TrendingUp}
          />
          <StatsCard
            title="Products"
            value={productsCount.count || 0}
            description="Product catalog"
            icon={Package}
          />
        </div>

        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle>{'Recent Users'}</CardTitle>
            <CardDescription>{'Newly registered members'}</CardDescription>
          </CardHeader>
          <CardContent>
            {recentUsers && recentUsers.length > 0 ? (
              <div className="space-y-4">
                {recentUsers.map((profile) => (
                  <div key={profile.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{profile.full_name}</p>
                      <p className="text-sm text-muted-foreground">{profile.email}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="capitalize">{profile.role}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{'No users found'}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
