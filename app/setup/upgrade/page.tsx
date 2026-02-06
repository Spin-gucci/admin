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

export default function UpgradeToMasterPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleUpgrade = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()

      // Find user by email
      const { data: profiles, error: fetchError } = await supabase
        .from('profiles')
        .select('id, email, role')
        .eq('email', email)
        .single()

      if (fetchError) throw new Error('User not found with this email')

      if (profiles.role === 'master') {
        throw new Error('This user is already a Master')
      }

      // Update role to master
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'master' })
        .eq('email', email)

      if (updateError) throw updateError

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to upgrade user to Master')
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
          <CardTitle className="text-2xl">{'Upgrade to Master'}</CardTitle>
          <CardDescription>
            {'Upgrade an existing user account to Master role'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="size-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {'User successfully upgraded to Master role! They can now login with full access.'}
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleUpgrade} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Alert>
                <AlertCircle className="size-4" />
                <AlertDescription>
                  {'Make sure the user has already signed up before upgrading their role.'}
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="email">{'User Email'}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
                <p className="text-sm text-muted-foreground">
                  {'Enter the email of the user you want to upgrade to Master'}
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Upgrading User...' : 'Upgrade to Master'}
              </Button>

              <div className="text-center">
                <a href="/setup" className="text-sm text-accent hover:underline">
                  {'Create new Master account instead'}
                </a>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
