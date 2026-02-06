import { getCurrentUser } from '@/lib/actions/auth'
import { getUsers } from '@/lib/actions/users'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { isAdminOrHigher } from '@/lib/rbac'
import Link from 'next/link'

export default async function UsersPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  if (!isAdminOrHigher(user.role)) {
    redirect('/dashboard')
  }

  const { data: users, error } = await getUsers()

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'master':
        return 'bg-accent text-accent-foreground'
      case 'admin':
        return 'bg-primary text-primary-foreground'
      case 'agent':
        return 'bg-secondary text-secondary-foreground'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{'User Management'}</h1>
            <p className="text-muted-foreground">{'View and manage all system users'}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{'All Users'}</CardTitle>
            <CardDescription>{'Complete list of registered users'}</CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center py-8">
                <p className="text-destructive">{error}</p>
              </div>
            ) : users && users.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{'User'}</TableHead>
                      <TableHead>{'Contact'}</TableHead>
                      <TableHead>{'Role'}</TableHead>
                      <TableHead>{'Balance'}</TableHead>
                      <TableHead>{'Joined'}</TableHead>
                      <TableHead className="text-right">{'Actions'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((profile) => {
                      const initials = profile.full_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)

                      return (
                        <TableRow key={profile.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="size-8">
                                <AvatarFallback className="bg-accent/10 text-accent text-xs">
                                  {initials}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-foreground">{profile.full_name}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm text-foreground">{profile.email}</p>
                              {profile.phone && (
                                <p className="text-xs text-muted-foreground">{profile.phone}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getRoleBadgeColor(profile.role)}>
                              {profile.role.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium text-foreground">
                              ${profile.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-muted-foreground">
                              {new Date(profile.created_at).toLocaleDateString()}
                            </p>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button asChild variant="outline" size="sm" className="bg-transparent">
                              <Link href={`/dashboard/users/${profile.id}`}>{'View'}</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{'No users found'}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
