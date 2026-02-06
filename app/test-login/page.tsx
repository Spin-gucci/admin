'use client'

import React from "react"

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useRouter } from 'next/navigation'

export default function TestLoginPage() {
  const [email, setEmail] = useState('master@demo.com')
  const [password, setPassword] = useState('Master123456')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const supabase = createClient()

      console.log('[v0] Attempting login with:', email)
      
      // Step 1: Sign in
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(`Auth Error: ${authError.message}`)
        console.log('[v0] Auth error:', authError)
        setLoading(false)
        return
      }

      console.log('[v0] Auth successful:', authData.user.id)
      setMessage('Login successful! Getting profile...')

      // Step 2: Get profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (profileError) {
        setError(`Profile Error: ${profileError.message}`)
        console.log('[v0] Profile error:', profileError)
        setLoading(false)
        return
      }

      console.log('[v0] Profile loaded:', profile)
      setMessage(`Success! Role: ${profile.role}. Redirecting...`)

      // Step 3: Redirect based on role
      setTimeout(() => {
        const roleRoutes: Record<string, string> = {
          master: '/dashboard/master',
          admin: '/dashboard/admin',
          agent: '/dashboard/agent',
          customer: '/dashboard/customer',
        }
        router.push(roleRoutes[profile.role] || '/dashboard')
      }, 1000)

    } catch (err: any) {
      setError(`Unexpected error: ${err.message}`)
      console.log('[v0] Unexpected error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test Login</CardTitle>
          <CardDescription>Debug login with detailed error messages</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="master@demo.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Master123456"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-4 p-4 bg-muted rounded-lg text-sm">
            <p className="font-medium mb-2">Default credentials:</p>
            <p>Email: master@demo.com</p>
            <p>Password: Master123456</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
