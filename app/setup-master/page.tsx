'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, CheckCircle2, AlertCircle, Copy } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SetupMasterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [step, setStep] = useState<'form' | 'created' | 'sql'>('form')
  const [userId, setUserId] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const supabase = createClient()

      // Step 1: Create regular user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'customer', // Start as customer
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (authError) throw authError

      if (authData.user) {
        setUserId(authData.user.id)
        setStep('created')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
    }
  }

  const sqlQuery = `-- Run this query in Supabase SQL Editor to upgrade to Master
UPDATE public.profiles 
SET role = 'master' 
WHERE email = '${email}';`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlQuery)
    alert('SQL query copied to clipboard!')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center size-16 rounded-full bg-accent/10">
              <Shield className="size-8 text-accent" />
            </div>
          </div>
          <CardTitle className="text-2xl">{'Setup Master Account'}</CardTitle>
          <CardDescription>
            {'Create your admin account in 2 simple steps'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'form' && (
            <form onSubmit={handleCreateAccount} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Alert>
                <AlertDescription>
                  <strong>{'Step 1:'}</strong> {'Create your account below'}
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="email">{'Email'}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{'Password'}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <p className="text-sm text-muted-foreground">{'Minimum 6 characters'}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">{'Full Name'}</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Master Admin"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{'Phone (Optional)'}</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+62 812 3456 7890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full">
                {'Create Account'}
              </Button>
            </form>
          )}

          {step === 'created' && (
            <div className="space-y-6">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="size-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {'Account created successfully!'}
                </AlertDescription>
              </Alert>

              <Alert>
                <AlertDescription>
                  <strong>{'Step 2:'}</strong> {'Upgrade your account to Master role'}
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label>{'Your User ID:'}</Label>
                  <code className="block mt-2 p-3 bg-muted rounded text-sm break-all">
                    {userId}
                  </code>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>{'SQL Query to Run:'}</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="bg-transparent"
                    >
                      <Copy className="size-4 mr-2" />
                      {'Copy'}
                    </Button>
                  </div>
                  <pre className="p-4 bg-muted rounded text-sm overflow-x-auto">
                    {sqlQuery}
                  </pre>
                </div>

                <Alert>
                  <AlertDescription className="space-y-2">
                    <p><strong>{'How to run this query:'}</strong></p>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>{'Go to your Supabase Dashboard'}</li>
                      <li>{'Click on "SQL Editor" in the left menu'}</li>
                      <li>{'Click "New query"'}</li>
                      <li>{'Paste the SQL query above'}</li>
                      <li>{'Click "Run" button'}</li>
                      <li>{'Come back here and click "Continue to Login"'}</li>
                    </ol>
                  </AlertDescription>
                </Alert>

                <div className="flex gap-4">
                  <Button 
                    className="flex-1" 
                    onClick={() => window.location.href = '/auth/login'}
                  >
                    {'Continue to Login'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 bg-transparent"
                    onClick={() => window.open('https://supabase.com/dashboard/project/_/sql', '_blank')}
                  >
                    {'Open Supabase SQL Editor'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
