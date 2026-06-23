// ─────────────────────────────────────────────────────────────────────────────
// Prisma enum mirrors
// These are kept in sync with prisma/schema.prisma.
// Using local enums makes the codebase compile even before `prisma generate`
// fully completes (e.g. in CI or restricted network environments).
// ─────────────────────────────────────────────────────────────────────────────

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  FOLLOW_UP = 'FOLLOW_UP',
  NEGOTIATION = 'NEGOTIATION',
  CONVERTED = 'CONVERTED',
  LOST = 'LOST',
}

export enum OutreachStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  OPENED = 'OPENED',
  REPLIED = 'REPLIED',
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  EXPORT = 'EXPORT',
}

export enum NotificationType {
  LEAD_UPDATE = 'LEAD_UPDATE',
  BUYER_MATCH = 'BUYER_MATCH',
  COMPLIANCE_ALERT = 'COMPLIANCE_ALERT',
  SYSTEM = 'SYSTEM',
  AI_INSIGHT = 'AI_INSIGHT',
}
