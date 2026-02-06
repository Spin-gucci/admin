import { getCurrentUser } from '@/lib/actions/auth'
import { getTransactions } from '@/lib/actions/transactions'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { isStaff } from '@/lib/rbac'
import Link from 'next/link'
import { TransactionActions } from '@/components/dashboard/transaction-actions'

export default async function TransactionsPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const { data: transactions, error } = await getTransactions()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600 text-white">{'Completed'}</Badge>
      case 'pending':
        return <Badge variant="secondary">{'Pending'}</Badge>
      case 'approved':
        return <Badge className="bg-blue-600 text-white">{'Approved'}</Badge>
      case 'rejected':
        return <Badge variant="destructive">{'Rejected'}</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{'Transactions'}</h1>
            <p className="text-muted-foreground">
              {isStaff(user.role) ? 'Manage all transactions' : 'View your transaction history'}
            </p>
          </div>
          {!isStaff(user.role) && (
            <Button asChild>
              <Link href="/dashboard/transactions/new">{'New Transaction'}</Link>
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{'All Transactions'}</CardTitle>
            <CardDescription>
              {isStaff(user.role) ? 'Complete transaction history' : 'Your transaction history'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center py-8">
                <p className="text-destructive">{error}</p>
              </div>
            ) : transactions && transactions.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {isStaff(user.role) && <TableHead>{'User'}</TableHead>}
                      <TableHead>{'Type'}</TableHead>
                      <TableHead>{'Amount'}</TableHead>
                      <TableHead>{'Status'}</TableHead>
                      <TableHead>{'Date'}</TableHead>
                      {isStaff(user.role) && <TableHead className="text-right">{'Actions'}</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        {isStaff(user.role) && (
                          <TableCell>
                            <div>
                              <p className="font-medium text-foreground">
                                {transaction.profiles?.full_name || 'Unknown'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {transaction.profiles?.email}
                              </p>
                            </div>
                          </TableCell>
                        )}
                        <TableCell>
                          <Badge variant="outline" className="capitalize bg-transparent">
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className={`font-semibold ${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'deposit' ? '+' : '-'}
                            ${Number(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </TableCell>
                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm text-foreground">
                              {new Date(transaction.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(transaction.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </TableCell>
                        {isStaff(user.role) && (
                          <TableCell className="text-right">
                            {transaction.status === 'pending' && (
                              <TransactionActions transactionId={transaction.id} />
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{'No transactions found'}</p>
                {!isStaff(user.role) && (
                  <Button asChild className="mt-4">
                    <Link href="/dashboard/transactions/new">{'Create Your First Transaction'}</Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
