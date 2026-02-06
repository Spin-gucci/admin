'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { UserPlus, CheckCircle2, AlertCircle } from 'lucide-react'
import { signUp } from './actions'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await signUp(formData)
      
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ 
          type: 'success', 
          text: 'Akun berhasil dibuat! Silakan kembali ke Admin Tools untuk promote ke Master.' 
        })
        
        // Redirect ke admin-tools setelah 2 detik
        setTimeout(() => {
          router.push('/admin-tools')
        }, 2000)
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Terjadi kesalahan saat membuat akun' 
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
              <UserPlus className="size-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Buat Akun Baru</CardTitle>
          <CardDescription>
            Daftarkan akun baru untuk sistem admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
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
                placeholder="user@example.com"
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
                placeholder="Nama Anda"
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Membuat Akun...' : 'Daftar'}
            </Button>

            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <a href="/admin-tools" className="text-primary hover:underline">
                Kembali ke Admin Tools
              </a>
              <span>•</span>
              <a href="/auth/login" className="text-primary hover:underline">
                Sudah punya akun?
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
