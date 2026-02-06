'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, Crown, AlertCircle, CheckCircle2 } from 'lucide-react'
import { promoteToMaster, getAllUsers } from './actions'

type User = {
  id: string
  email: string
  full_name: string | null
  role: string
}

export default function AdminToolsPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [promoting, setPromoting] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    setLoading(true)
    const result = await getAllUsers()
    if (result.users) {
      setUsers(result.users)
    }
    setLoading(false)
  }

  async function handlePromote(userId: string) {
    setPromoting(userId)
    setMessage(null)

    const result = await promoteToMaster(userId)
    
    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'User berhasil dipromosikan menjadi Master!' })
      await loadUsers()
    }
    
    setPromoting(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-12 rounded-full bg-primary/10">
                <Shield className="size-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Admin Tools</CardTitle>
                <CardDescription>
                  Promote user menjadi Master untuk akses penuh
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Catatan:</strong> Halaman ini dapat diakses tanpa login untuk setup awal. 
                Setelah ada Master, sebaiknya halaman ini dihapus atau diproteksi.
              </p>
            </div>

            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Memuat daftar user...
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Belum ada user terdaftar</p>
                <Button asChild>
                  <a href="/auth/signup">Daftar Akun Baru</a>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="font-semibold">Daftar User:</h3>
                {users.map((user) => (
                  <div 
                    key={user.id} 
                    className="flex items-center justify-between p-4 border rounded-lg bg-white"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{user.email}</p>
                        {user.role === 'master' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
                            <Crown className="size-3" />
                            Master
                          </span>
                        )}
                        {user.role && user.role !== 'master' && (
                          <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                            {user.role}
                          </span>
                        )}
                      </div>
                      {user.full_name && (
                        <p className="text-sm text-muted-foreground">{user.full_name}</p>
                      )}
                    </div>
                    
                    {user.role !== 'master' && (
                      <Button
                        onClick={() => handlePromote(user.id)}
                        disabled={promoting === user.id}
                        size="sm"
                      >
                        {promoting === user.id ? 'Memproses...' : 'Jadikan Master'}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 border-t">
              <Button asChild variant="outline" className="w-full">
                <a href="/auth/signup">Buat Akun Baru</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
