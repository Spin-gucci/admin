'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Users, CreditCard, Package, Activity, Settings, LogOut, Type as type, LucideIcon } from 'lucide-react'
import { UserRole } from '@/lib/types/database'

interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  roles?: UserRole[]
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Users',
    href: '/dashboard/users',
    icon: Users,
    roles: ['master', 'admin'],
  },
  {
    title: 'Transactions',
    href: '/dashboard/transactions',
    icon: CreditCard,
  },
  {
    title: 'Products',
    href: '/dashboard/products',
    icon: Package,
  },
  {
    title: 'Activity Logs',
    href: '/dashboard/activity',
    icon: Activity,
    roles: ['master', 'admin', 'agent'],
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

interface SidebarProps {
  userRole: UserRole
  onSignOut: () => void
}

export function Sidebar({ userRole, onSignOut }: SidebarProps) {
  const pathname = usePathname()

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true
    return item.roles.includes(userRole)
  })

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="p-6">
        <h2 className="text-lg font-bold text-foreground">{'Admin Dashboard'}</h2>
        <p className="text-sm text-muted-foreground capitalize">{userRole} {'Panel'}</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {filteredNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  isActive && 'bg-secondary text-secondary-foreground'
                )}
              >
                <Icon className="size-4 mr-2" />
                {item.title}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onSignOut}
        >
          <LogOut className="size-4 mr-2" />
          {'Sign Out'}
        </Button>
      </div>
    </div>
  )
}
