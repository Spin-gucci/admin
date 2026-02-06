'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Copy, Database, ArrowRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function QuickSetupPage() {
  const sqlQuery = `-- Upgrade user yang sudah sign up ke Master
UPDATE public.profiles 
SET role = 'master' 
WHERE email = 'master@demo.com';`

  const upgradeQuery = `-- Atau upgrade user yang sudah ada:
UPDATE public.profiles 
SET role = 'master' 
WHERE email = 'your-email@example.com';`

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Quick Master Setup</h1>
          <p className="text-lg text-muted-foreground">
            Bypass email rate limit dengan SQL query langsung
          </p>
        </div>

        {/* Alert Info */}
        <Alert>
          <Database className="size-4" />
          <AlertDescription>
            Metode ini membuat Master user langsung di database tanpa email confirmation.
            Solusi terbaik untuk mengatasi rate limit.
          </AlertDescription>
        </Alert>

        {/* Method 1: Create New Master */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-accent/10">
                <span className="text-lg font-bold text-accent">1</span>
              </div>
              <div>
                <CardTitle>Sign Up Akun Biasa Dulu</CardTitle>
                <CardDescription>Langkah pertama</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Buat akun baru di halaman sign up dengan kredensial ini:
              </p>
              <div className="rounded-lg bg-muted p-4 font-mono text-sm">
                <div>Email: master@demo.com</div>
                <div>Password: Master123456</div>
                <div>Full Name: Master Admin</div>
              </div>
            </div>

            <Alert>
              <AlertDescription className="text-sm">
                Jika muncul rate limit error, tidak masalah. Akun tetap akan terbuat di database.
              </AlertDescription>
            </Alert>

            <Button asChild className="w-full">
              <Link href="/auth/sign-up">
                Buka Sign Up Page
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Method 2: Upgrade to Master */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-accent/10">
                <span className="text-lg font-bold text-accent">2</span>
              </div>
              <div>
                <CardTitle>Upgrade ke Master dengan SQL</CardTitle>
                <CardDescription>Setelah sign up</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">SQL Query:</label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(sqlQuery)}
                  className="gap-2 bg-transparent"
                >
                  <Copy className="size-4" />
                  Copy Query
                </Button>
              </div>
              <pre className="rounded-lg bg-muted p-4 text-sm overflow-x-auto">
                {sqlQuery}
              </pre>
            </div>

            <div className="space-y-3 rounded-lg border border-border bg-card p-4">
              <p className="text-sm font-medium">Langkah-langkah:</p>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="font-medium text-foreground">1.</span>
                  <span>Copy SQL query di atas</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-foreground">2.</span>
                  <span>Buka Supabase Dashboard → SQL Editor</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-foreground">3.</span>
                  <span>Paste dan klik Run</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-foreground">4.</span>
                  <span>Selesai! Akun sudah jadi Master</span>
                </li>
              </ol>
            </div>

            <Button asChild className="w-full">
              <a
                href="https://supabase.com/dashboard/project/_/sql"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Database className="mr-2 size-4" />
                Buka Supabase SQL Editor
              </a>
            </Button>
          </CardContent>
        </Card>



        {/* Next Steps */}
        <Card className="border-accent/50 bg-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-accent" />
              Setelah Menjalankan Query
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Login dengan:</p>
              <div className="rounded-lg bg-background p-4 font-mono text-sm">
                <div>Email: master@demo.com</div>
                <div>Password: Master123456</div>
              </div>
            </div>

            <Button asChild size="lg" className="w-full">
              <Link href="/auth/login">
                Lanjut ke Login
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              • Untuk mengubah email/password, edit nilai di SQL query sebelum dijalankan
            </p>
            <p>
              • Password akan otomatis ter-hash dengan bcrypt saat disimpan
            </p>
            <p>
              • Setelah Master dibuat, Anda bisa membuat user lain dari dashboard
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
