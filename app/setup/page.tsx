'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, CheckCircle2, AlertCircle } from 'lucide-react'
import { setupMasterAccount } from './actions'
import { useRouter } from 'next/navigation'

export default function SetupPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  async function handleSetup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('full_name') as string

    console.log('[v0] Submitting setup form:', { email, fullName })
    
    try {
      // Gunakan API route yang menggunakan service role (bypass rate limit!)
      const response = await fetch('/api/create-master', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          fullName,
        }),
      })

      const result = await response.json()
      console.log('[v0] API response:', result)
      
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ 
          type: 'success', 
          text: result.message || 'Akun master berhasil dibuat! Silakan login.' 
        })
        
        // Redirect ke login setelah 2 detik
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      }
    } catch (error: any) {
      console.error('[v0] Setup error:', error)
      setMessage({ 
        type: 'error', 
        text: error.message || 'Terjadi kesalahan saat membuat akun' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="flex items-center justify-center mb-2">
            <div className="flex items-center justify-center size-16 rounded-full bg-primary/10">
              <Shield className="size-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Setup Akun Master</CardTitle>
          <CardDescription>
            Buat akun master pertama untuk mengakses dashboard admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetup} className="space-y-4">
            {message && (
              <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className={message.type === 'success' ? 'bg-green-50 border-green-200' : ''}>
                {message.type === 'success' ? (
                  <CheckCircle2 className="size-4 text-green-600" />
                ) : (
                  <AlertCircle className="size-4" />
                )}
                <AlertDescription className={message.type === 'success' ? 'text-green-800' : ''}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="master@admin.com"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Minimal 6 karakter"
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Nama Lengkap</Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="Master Admin"
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Membuat Akun...' : 'Buat Akun Master'}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Sudah punya akun?{' '}
              <a href="/auth/login" className="text-primary hover:underline">
                Login di sini
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
