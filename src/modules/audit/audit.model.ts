import { Schema, model } from 'mongoose';
import type { IAuditLogDocument, IAuditLogModel } from './audit.interface';

const auditLogSchema = new Schema<IAuditLogDocument, IAuditLogModel>(
  {
    actor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    actorRole: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    entity: {
      type: String,
      required: true,
      trim: true,
    },
    entityId: {
      type: String,
    },
    details: {
      type: Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

auditLogSchema.index({ entity: 1, entityId: 1 });
auditLogSchema.index({ createdAt: -1 });

export const AuditLog = model<IAuditLogDocument, IAuditLogModel>('AuditLog', auditLogSchema);
