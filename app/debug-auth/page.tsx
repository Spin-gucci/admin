import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle2, XCircle, AlertCircle, Home } from 'lucide-react'

export default async function DebugAuthPage() {
  const supabase = await createClient()
  
  // Check auth user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  // Check profile if user exists
  let profile = null
  let profileError = null
  
  if (user) {
    const result = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    profile = result.data
    profileError = result.error
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{'Authentication Debug'}</h1>
            <p className="text-muted-foreground">{'Check your authentication and profile status'}</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="mr-2 size-4" />
              {'Home'}
            </Link>
          </Button>
        </div>

        {/* Auth Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {user ? (
                <>
                  <CheckCircle2 className="size-5 text-green-600" />
                  {'Authentication Status: Logged In'}
                </>
              ) : (
                <>
                  <XCircle className="size-5 text-red-600" />
                  {'Authentication Status: Not Logged In'}
                </>
              )}
            </CardTitle>
            <CardDescription>
              {user ? 'You are currently authenticated' : 'You need to log in'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {authError && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertTitle>{'Authentication Error'}</AlertTitle>
                <AlertDescription className="font-mono text-xs">
                  {authError.message}
                </AlertDescription>
              </Alert>
            )}
            
            {user && (
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium text-muted-foreground">{'User ID:'}</div>
                  <div className="font-mono text-xs break-all">{user.id}</div>
                  
                  <div className="font-medium text-muted-foreground">{'Email:'}</div>
                  <div>{user.email}</div>
                  
                  <div className="font-medium text-muted-foreground">{'Email Confirmed:'}</div>
                  <div>
                    {user.email_confirmed_at ? (
                      <Badge variant="default" className="bg-green-600">{'Yes'}</Badge>
                    ) : (
                      <Badge variant="destructive">{'No'}</Badge>
                    )}
                  </div>
                  
                  <div className="font-medium text-muted-foreground">{'Created At:'}</div>
                  <div>{new Date(user.created_at || '').toLocaleString()}</div>
                </div>
              </div>
            )}
            
            {!user && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {'You are not currently logged in. Please sign in to continue.'}
                </p>
                <Button asChild>
                  <Link href="/auth/login">{'Go to Login'}</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Status */}
        {user && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {profile ? (
                  <>
                    <CheckCircle2 className="size-5 text-green-600" />
                    {'Profile Status: Found'}
                  </>
                ) : (
                  <>
                    <XCircle className="size-5 text-red-600" />
                    {'Profile Status: Not Found'}
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {profile ? 'Your profile exists in the database' : 'Profile not found in database'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileError && (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertTitle>{'Profile Error'}</AlertTitle>
                  <AlertDescription className="font-mono text-xs">
                    {profileError.message}
                  </AlertDescription>
                </Alert>
              )}
              
              {profile && (
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium text-muted-foreground">{'Full Name:'}</div>
                    <div>{profile.full_name}</div>
                    
                    <div className="font-medium text-muted-foreground">{'Email:'}</div>
                    <div>{profile.email}</div>
                    
                    <div className="font-medium text-muted-foreground">{'Phone:'}</div>
                    <div>{profile.phone || '-'}</div>
                    
                    <div className="font-medium text-muted-foreground">{'Role:'}</div>
                    <div>
                      <Badge 
                        variant={
                          profile.role === 'master' ? 'default' : 
                          profile.role === 'admin' ? 'secondary' : 
                          'outline'
                        }
                        className={
                          profile.role === 'master' ? 'bg-amber-600' :
                          profile.role === 'admin' ? 'bg-blue-600' :
                          ''
                        }
                      >
                        {profile.role?.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="font-medium text-muted-foreground">{'Balance:'}</div>
                    <div className="font-mono">{profile.balance || '0.00'}</div>
                    
                    <div className="font-medium text-muted-foreground">{'Created At:'}</div>
                    <div>{new Date(profile.created_at).toLocaleString()}</div>
                  </div>
                </div>
              )}
              
              {!profile && !profileError && (
                <Alert>
                  <AlertCircle className="size-4" />
                  <AlertTitle>{'Profile Not Found'}</AlertTitle>
                  <AlertDescription>
                    {'Your profile was not created properly. This might happen if the database trigger is not set up correctly.'}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Troubleshooting Tips */}
        <Card>
          <CardHeader>
            <CardTitle>{'Common Issues & Solutions'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="flex gap-2">
                <AlertCircle className="size-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">{'Email not confirmed'}</div>
                  <div className="text-muted-foreground">
                    {'Disable email confirmation in Supabase Dashboard > Authentication > Providers > Email'}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <AlertCircle className="size-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">{'Profile not found'}</div>
                  <div className="text-muted-foreground">
                    {'Make sure database triggers are set up correctly. Run scripts/003_create_triggers.sql'}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <AlertCircle className="size-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">{'Need Master role'}</div>
                  <div className="text-muted-foreground">
                    {'Use /setup-master or run: UPDATE public.profiles SET role = \'master\' WHERE email = \'your@email.com\';'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex gap-2">
                <Button asChild variant="outline">
                  <Link href="/setup-master">{'Setup Master Account'}</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="https://github.com/Spin-gucci/admin/blob/main/TROUBLESHOOTING.md" target="_blank" rel="noopener noreferrer">
                    {'View Full Guide'}
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
