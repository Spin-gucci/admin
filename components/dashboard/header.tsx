import { Profile } from '@/lib/types/database'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface HeaderProps {
  user: Profile
}

export function Header({ user }: HeaderProps) {
  const initials = user.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'master':
        return 'bg-accent text-accent-foreground'
      case 'admin':
        return 'bg-primary text-primary-foreground'
      case 'agent':
        return 'bg-secondary text-secondary-foreground'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="flex items-center justify-between p-6 bg-card border-b border-border">
      <div className="flex items-center gap-4">
        <Avatar className="size-10">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-foreground">{user.full_name}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Badge className={getRoleBadgeColor(user.role)}>
          {user.role.toUpperCase()}
        </Badge>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">{'Balance'}</p>
          <p className="font-semibold text-foreground">
            ${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  )
}
