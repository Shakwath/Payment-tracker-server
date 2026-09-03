import type { Document, Model, Types } from 'mongoose';

export interface IAuditLog {
  actor: Types.ObjectId;
  actorRole: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt?: Date;
}

export interface IAuditLogDocument extends IAuditLog, Document {}
export type IAuditLogModel = Model<IAuditLogDocument>;
