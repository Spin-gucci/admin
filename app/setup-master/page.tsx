'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Crown, CheckCircle2, Copy, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function SetupMasterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
  })
  const [step, setStep] = useState<'form' | 'created' | 'error'>('form')
  const [sqlQuery, setSqlQuery] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('/api/setup-master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account')
      }
      
      const query = `UPDATE public.profiles SET role = 'master' WHERE email = '${formData.email}';`
      setSqlQuery(query)
      setStep('created')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setStep('error')
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlQuery)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (step === 'created') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center justify-center size-12 rounded-full bg-green-500">
                <CheckCircle2 className="size-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">{'Account Created!'}</CardTitle>
            <CardDescription className="text-center">
              {'Now run this SQL query in Supabase to make the account a Master'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription className="font-mono text-sm break-all">
                {sqlQuery}
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label>{'Steps to Complete Setup:'}</Label>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>{'Open your Supabase Dashboard'}</li>
                <li>{'Click "SQL Editor" in the left menu'}</li>
                <li>{'Click "New query"'}</li>
                <li>{'Paste the SQL query above'}</li>
                <li>{'Click "Run" to execute the query'}</li>
                <li>{'Return here and click "Continue to Login"'}</li>
              </ol>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button onClick={copyToClipboard} variant="outline" className="w-full">
              {copied ? (
                <>
                  <CheckCircle2 className="mr-2 size-4" />
                  {'Copied!'}
                </>
              ) : (
                <>
                  <Copy className="mr-2 size-4" />
                  {'Copy SQL Query'}
                </>
              )}
            </Button>
            <Link href="/auth/login" className="w-full">
              <Button className="w-full">
                {'Continue to Login'}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (step === 'error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center justify-center size-12 rounded-full bg-destructive">
                <AlertCircle className="size-6 text-destructive-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">{'Setup Failed'}</CardTitle>
            <CardDescription className="text-center">
              {error}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => setStep('form')} className="w-full">
              {'Try Again'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center size-12 rounded-full bg-amber-500">
              <Crown className="size-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">{'Setup Master Account'}</CardTitle>
          <CardDescription className="text-center">
            {'Create your first master administrator account'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">{'Full Name'}</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Master Administrator"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{'Email'}</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@yourcompany.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{'Phone (Optional)'}</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+62 812 3456 7890"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{'Password'}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-background"
              />
            </div>
            
            <Alert>
              <AlertDescription className="text-xs">
                {'After creating the account, you\'ll need to run a SQL query in Supabase to grant master privileges.'}
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              {'Create Master Account'}
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
