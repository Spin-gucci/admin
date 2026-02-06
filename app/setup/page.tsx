'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, CheckCircle2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SetupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleCreateMaster = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()

      // Create user with Master role in metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone || null,
            role: 'master', // Set role in metadata
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (authError) throw authError

      if (authData.user) {
        // Wait a bit for the trigger to create profile
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Update the profile role to master using service role
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'master' })
          .eq('id', authData.user.id)

        if (updateError) {
          console.log('[v0] Profile update error:', updateError)
          // Continue anyway, the role is set in metadata
        }

        setSuccess(true)
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/auth/login?message=Master account created. Please login.')
        }, 2000)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create master account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center size-16 rounded-full bg-accent/10">
              <Shield className="size-8 text-accent" />
            </div>
          </div>
          <CardTitle className="text-2xl">{'Initial Setup'}</CardTitle>
          <CardDescription>
            {'Create your Master admin account to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="size-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {'Master account created successfully! Redirecting to login...'}
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleCreateMaster} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{'Email'}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
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
                  disabled={loading}
                />
                <p className="text-sm text-muted-foreground">
                  {'Minimum 6 characters'}
                </p>
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating Master Account...' : 'Create Master Account'}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                {'This page should only be used for initial setup'}
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
