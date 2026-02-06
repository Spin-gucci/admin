import { signUp } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import { UserPlus, AlertCircle } from 'lucide-react'

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const error = params.error
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center size-12 rounded-full bg-primary">
              <UserPlus className="size-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">{'Create Account'}</CardTitle>
          <CardDescription className="text-center">
            {'Enter your information to get started'}
          </CardDescription>
        </CardHeader>
        <form action={signUp}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="fullName">{'Full Name'}</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="John Doe"
                required
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{'Email'}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{'Phone (Optional)'}</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1234567890"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{'Password'}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                className="bg-background"
              />
            </div>
            <input type="hidden" name="role" value="customer" />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              {'Create Account'}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              {'Already have an account? '}
              <Link href="/auth/login" className="text-accent hover:underline font-medium">
                {'Sign in'}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
