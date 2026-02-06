import { getCurrentUser } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { StatsCard } from '@/components/dashboard/stats-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { Users, CreditCard, Package, Activity, TrendingUp, DollarSign } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default async function MasterDashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  if (user.role !== 'master') {
    redirect(getDashboardRoute(user.role))
  }

  const supabase = await createClient()

  // Fetch statistics
  const [usersCount, transactionsCount, productsCount, pendingTransactions] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('transactions').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('transactions').select('*').eq('status', 'pending').limit(5),
  ])

  // Calculate total transaction value
  const { data: allTransactions } = await supabase
    .from('transactions')
    .select('amount, type, status')
    .eq('status', 'completed')

  const totalRevenue = allTransactions?.reduce((sum, t) => {
    return t.type === 'deposit' ? sum + Number(t.amount) : sum
  }, 0) || 0

  const totalWithdrawals = allTransactions?.reduce((sum, t) => {
    return t.type === 'withdrawal' ? sum + Number(t.amount) : sum
  }, 0) || 0

  // Recent activities
  const { data: recentActivities } = await supabase
    .from('activity_logs')
    .select('*, profiles!activity_logs_user_id_fkey(full_name)')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{'Master Dashboard'}</h1>
          <p className="text-muted-foreground">{'Complete system overview and management'}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Users"
            value={usersCount.count || 0}
            description="All registered users"
            icon={Users}
          />
          <StatsCard
            title="Total Transactions"
            value={transactionsCount.count || 0}
            description="All time transactions"
            icon={CreditCard}
          />
          <StatsCard
            title="Products"
            value={productsCount.count || 0}
            description="Active products"
            icon={Package}
          />
          <StatsCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            description="Completed deposits"
            icon={DollarSign}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Pending Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>{'Pending Transactions'}</CardTitle>
              <CardDescription>{'Transactions awaiting approval'}</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingTransactions.data && pendingTransactions.data.length > 0 ? (
                <div className="space-y-4">
                  {pendingTransactions.data.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground capitalize">
                          {transaction.type}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          ${Number(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <Badge variant="secondary">{'Pending'}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{'No pending transactions'}</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>{'Recent Activity'}</CardTitle>
              <CardDescription>{'Latest system activities'}</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivities && recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="flex items-center justify-center size-8 rounded-full bg-accent/10 flex-shrink-0">
                        <Activity className="size-4 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {activity.profiles?.full_name || 'System'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.action} {activity.entity_type}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{'No recent activities'}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

function getDashboardRoute(role: string): string {
  return `/dashboard/${role}`
}
