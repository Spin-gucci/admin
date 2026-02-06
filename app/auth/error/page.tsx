import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center size-12 rounded-full bg-destructive/10">
              <AlertCircle className="size-6 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">{'Authentication Error'}</CardTitle>
          <CardDescription className="text-center">
            {'Something went wrong during authentication. Please try again.'}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/auth/login">{'Back to Sign In'}</Link>
          </Button>
          <Button asChild variant="outline" className="w-full bg-transparent">
            <Link href="/auth/sign-up">{'Create Account'}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
