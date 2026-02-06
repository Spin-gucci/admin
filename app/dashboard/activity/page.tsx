import { getCurrentUser } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { isStaff } from '@/lib/rbac'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Activity } from 'lucide-react'

export default async function ActivityLogsPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  if (!isStaff(user.role)) {
    redirect('/dashboard')
  }

  const supabase = await createClient()

  // Fetch activity logs
  const { data: logs } = await supabase
    .from('activity_logs')
    .select('*, profiles!activity_logs_user_id_fkey(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{'Activity Logs'}</h1>
          <p className="text-muted-foreground">{'System-wide activity audit trail'}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{'Recent Activities'}</CardTitle>
            <CardDescription>{'Last 100 activities across the system'}</CardDescription>
          </CardHeader>
          <CardContent>
            {logs && logs.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{'User'}</TableHead>
                      <TableHead>{'Action'}</TableHead>
                      <TableHead>{'Entity'}</TableHead>
                      <TableHead>{'Date & Time'}</TableHead>
                      <TableHead>{'IP Address'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">
                              {log.profiles?.full_name || 'System'}
                            </p>
                            {log.profiles?.email && (
                              <p className="text-xs text-muted-foreground">
                                {log.profiles.email}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center size-6 rounded-full bg-accent/10">
                              <Activity className="size-3 text-accent" />
                            </div>
                            <span className="capitalize text-foreground">{log.action}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="capitalize text-foreground">{log.entity_type}</p>
                          {log.entity_id && (
                            <p className="text-xs text-muted-foreground font-mono">
                              {log.entity_id.slice(0, 8)}...
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm text-foreground">
                              {new Date(log.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(log.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-muted-foreground font-mono">
                            {log.ip_address || 'N/A'}
                          </p>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{'No activity logs found'}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
