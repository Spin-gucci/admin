import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Link from 'next/link'
import { Shield, Users, TrendingUp, Lock, Crown } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center size-16 rounded-full bg-accent/10">
              <Shield className="size-8 text-accent" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            {'Financial Management Dashboard'}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {'Professional admin dashboard with role-based access control. Manage members, transactions, and products with enterprise-grade security and comprehensive audit trails.'}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-4">
            <Button asChild size="lg">
              <Link href="/auth/login">{'Sign In'}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent">
              <Link href="/auth/sign-up">{'Get Started'}</Link>
            </Button>
          </div>
          
          {/* Master Setup Alert */}
          <div className="mt-12 max-w-2xl mx-auto">
            <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800">
              <Crown className="size-4 text-amber-600 dark:text-amber-400" />
              <AlertTitle className="text-amber-900 dark:text-amber-100">
                {'Setting up for the first time?'}
              </AlertTitle>
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                {'Need to create a Master admin account? '}
                <Link href="/setup-master" className="font-medium underline hover:no-underline">
                  {'Click here for easy setup'}
                </Link>
                {' or check the '}
                <Link href="https://github.com/Spin-gucci/admin/blob/main/TROUBLESHOOTING.md" className="font-medium underline hover:no-underline" target="_blank" rel="noopener noreferrer">
                  {'troubleshooting guide'}
                </Link>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            {'Key Features'}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-center size-12 rounded-full bg-accent/10 mb-4">
                  <Lock className="size-6 text-accent" />
                </div>
                <CardTitle>{'Role-Based Access Control'}</CardTitle>
                <CardDescription>
                  {'4-tier user hierarchy: Master, Admin, Agent, and Customer with granular permissions'}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-center size-12 rounded-full bg-accent/10 mb-4">
                  <TrendingUp className="size-6 text-accent" />
                </div>
                <CardTitle>{'Transaction Management'}</CardTitle>
                <CardDescription>
                  {'Complete deposit and withdrawal workflows with approval processes and balance tracking'}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-center size-12 rounded-full bg-accent/10 mb-4">
                  <Users className="size-6 text-accent" />
                </div>
                <CardTitle>{'User Management'}</CardTitle>
                <CardDescription>
                  {'Comprehensive member management with profile tracking and activity monitoring'}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            {'Ready to get started?'}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {'Create your account today and access the powerful admin dashboard'}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/auth/sign-up">{'Create Account'}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent">
              <Link href="/auth/login">{'Sign In'}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
