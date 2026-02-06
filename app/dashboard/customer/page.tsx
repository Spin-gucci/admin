import { getCurrentUser } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { StatsCard } from '@/components/dashboard/stats-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { CreditCard, ShoppingBag, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function CustomerDashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const supabase = await createClient()

  // Fetch user's transactions
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const totalDeposits = transactions?.filter(t => t.type === 'deposit' && t.status === 'completed').reduce((sum, t) => sum + Number(t.amount), 0) || 0
  const totalWithdrawals = transactions?.filter(t => t.type === 'withdrawal' && t.status === 'completed').reduce((sum, t) => sum + Number(t.amount), 0) || 0
  const pendingCount = transactions?.filter(t => t.status === 'pending').length || 0

  // Recent transactions
  const recentTransactions = transactions?.slice(0, 5) || []

  // Available products
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(4)

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{'Welcome Back!'}</h1>
          <p className="text-muted-foreground">{'Manage your account and view your transactions'}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Current Balance"
            value={`$${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            description="Available balance"
            icon={CreditCard}
          />
          <StatsCard
            title="Total Deposits"
            value={`$${totalDeposits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            description="Completed deposits"
            icon={ArrowUpCircle}
          />
          <StatsCard
            title="Total Withdrawals"
            value={`$${totalWithdrawals.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            description="Completed withdrawals"
            icon={ArrowDownCircle}
          />
          <StatsCard
            title="Pending"
            value={pendingCount}
            description="Awaiting approval"
            icon={CreditCard}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{'Recent Transactions'}</CardTitle>
                <CardDescription>{'Your latest transactions'}</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm" className="bg-transparent">
                <Link href="/dashboard/transactions">{'View All'}</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentTransactions.length > 0 ? (
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground capitalize">
                            {transaction.type}
                          </p>
                          <Badge 
                            variant={
                              transaction.status === 'completed' ? 'default' :
                              transaction.status === 'pending' ? 'secondary' :
                              'destructive'
                            }
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <p className={`font-semibold ${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'deposit' ? '+' : '-'}
                        ${Number(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">{'No transactions yet'}</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{'Quick Actions'}</CardTitle>
              <CardDescription>{'Manage your account'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full" size="lg">
                <Link href="/dashboard/transactions/new?type=deposit">
                  <ArrowUpCircle className="size-4 mr-2" />
                  {'Make Deposit'}
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent" size="lg">
                <Link href="/dashboard/transactions/new?type=withdrawal">
                  <ArrowDownCircle className="size-4 mr-2" />
                  {'Request Withdrawal'}
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent" size="lg">
                <Link href="/dashboard/products">
                  <ShoppingBag className="size-4 mr-2" />
                  {'Browse Products'}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Available Products */}
        {products && products.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{'Available Products'}</CardTitle>
                <CardDescription>{'Featured marketplace items'}</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm" className="bg-transparent">
                <Link href="/dashboard/products">{'View All'}</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                  <div key={product.id} className="p-4 rounded-lg border border-border">
                    <h3 className="font-semibold text-foreground mb-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {product.description || 'No description'}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-foreground">
                        ${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <Badge variant="secondary">{product.stock} {'in stock'}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
