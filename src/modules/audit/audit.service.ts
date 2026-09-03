import { AuditLog } from './audit.model';

export const getAllAuditLogsService = async (query: {
  action?: string;
  entity?: string;
  actorId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) => {
  const { action, entity, actorId, startDate, endDate, page = 1, limit = 20 } = query;
  const filter: any = {};

  if (action) filter.action = action;
  if (entity) filter.entity = entity;
  if (actorId) filter.actor = actorId;

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await AuditLog.countDocuments(filter);
  const auditLogs = await AuditLog.find(filter)
    .populate('actor', 'name email role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    auditLogs,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};
