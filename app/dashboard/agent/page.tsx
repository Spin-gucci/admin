import { getCurrentUser } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { StatsCard } from '@/components/dashboard/stats-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { CreditCard, Package, CheckCircle, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function AgentDashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  if (user.role !== 'agent' && user.role !== 'admin' && user.role !== 'master') {
    redirect('/dashboard')
  }

  const supabase = await createClient()

  // Fetch statistics
  const [transactionsCount, productsCount, pendingCount, completedCount] = await Promise.all([
    supabase.from('transactions').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('transactions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('transactions').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
  ])

  // Pending transactions for review
  const { data: pendingTransactions } = await supabase
    .from('transactions')
    .select('*, profiles!transactions_user_id_fkey(full_name, email)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{'Agent Dashboard'}</h1>
            <p className="text-muted-foreground">{'Manage transactions and product catalog'}</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/transactions">{'View All Transactions'}</Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Transactions"
            value={transactionsCount.count || 0}
            description="All transactions"
            icon={CreditCard}
          />
          <StatsCard
            title="Pending"
            value={pendingCount.count || 0}
            description="Awaiting approval"
            icon={Clock}
          />
          <StatsCard
            title="Completed"
            value={completedCount.count || 0}
            description="Successfully processed"
            icon={CheckCircle}
          />
          <StatsCard
            title="Products"
            value={productsCount.count || 0}
            description="Available products"
            icon={Package}
          />
        </div>

        {/* Pending Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>{'Pending Transactions'}</CardTitle>
            <CardDescription>{'Transactions requiring your attention'}</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingTransactions && pendingTransactions.length > 0 ? (
              <div className="space-y-4">
                {pendingTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-foreground capitalize">
                          {transaction.type}
                        </p>
                        <Badge variant="secondary">{'Pending'}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {transaction.profiles?.full_name} - {transaction.profiles?.email}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(transaction.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-foreground">
                        ${Number(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <Button asChild size="sm" className="mt-2">
                        <Link href={`/dashboard/transactions`}>{'Review'}</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{'No pending transactions'}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
