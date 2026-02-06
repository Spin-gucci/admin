import { UserRole } from './types/database'

// Role hierarchy
const roleHierarchy: Record<UserRole, number> = {
  master: 4,
  admin: 3,
  agent: 2,
  customer: 1,
}

// Check if user has specific role
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

// Check if user is staff (master, admin, or agent)
export function isStaff(role: UserRole): boolean {
  return ['master', 'admin', 'agent'].includes(role)
}

// Check if user is admin level or higher
export function isAdminOrHigher(role: UserRole): boolean {
  return ['master', 'admin'].includes(role)
}

// Check if user is master
export function isMaster(role: UserRole): boolean {
  return role === 'master'
}

// Permissions for different entities
export const permissions = {
  profiles: {
    view: (role: UserRole) => isStaff(role),
    create: (role: UserRole) => isAdminOrHigher(role),
    update: (role: UserRole) => isAdminOrHigher(role),
    delete: (role: UserRole) => isMaster(role),
  },
  transactions: {
    view: (role: UserRole) => isStaff(role),
    create: () => true, // All users can create their own transactions
    update: (role: UserRole) => isStaff(role),
    delete: (role: UserRole) => isAdminOrHigher(role),
    approve: (role: UserRole) => isStaff(role),
  },
  products: {
    view: () => true, // All users can view products
    create: (role: UserRole) => isStaff(role),
    update: (role: UserRole) => isStaff(role),
    delete: (role: UserRole) => isAdminOrHigher(role),
  },
  activityLogs: {
    view: (role: UserRole) => isStaff(role),
  },
}

// Get dashboard route based on role
export function getDashboardRoute(role: UserRole): string {
  switch (role) {
    case 'master':
      return '/dashboard/master'
    case 'admin':
      return '/dashboard/admin'
    case 'agent':
      return '/dashboard/agent'
    case 'customer':
      return '/dashboard/customer'
    default:
      return '/dashboard'
  }
}

// Get accessible features for a role
export function getAccessibleFeatures(role: UserRole) {
  return {
    canManageUsers: isAdminOrHigher(role),
    canManageTransactions: isStaff(role),
    canManageProducts: isStaff(role),
    canViewAllTransactions: isStaff(role),
    canApproveTransactions: isStaff(role),
    canViewActivityLogs: isStaff(role),
    canManageRoles: isMaster(role),
    canDeleteUsers: isMaster(role),
  }
}
