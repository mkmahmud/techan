
export const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  USER: 'user',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]
