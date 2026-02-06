'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CardContent, CardFooter } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import { useEffect, useState } from 'react'

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Sedang Login...
        </>
      ) : (
        'Sign In'
      )}
    </Button>
  )
}

interface LoginFormProps {
  error?: string
  signIn: (formData: FormData) => Promise<void>
}

export function LoginForm({ error, signIn }: LoginFormProps) {
  const [clientError, setClientError] = useState<string | undefined>(error)

  useEffect(() => {
    setClientError(error)
  }, [error])

  return (
    <form action={signIn}>
      <CardContent className="space-y-4">
        {clientError && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{clientError}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="anda@example.com"
            required
            className="bg-background"
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            className="bg-background"
            autoComplete="current-password"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <SubmitButton />
        <p className="text-sm text-center text-muted-foreground">
          Belum punya akun?{' '}
          <Link href="/auth/sign-up" className="text-accent hover:underline font-medium">
            Daftar di sini
          </Link>
        </p>
      </CardFooter>
    </form>
  )
}
