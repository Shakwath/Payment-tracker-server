import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/apiResponse';
import { getAllAuditLogsService } from './audit.service';

export const getAllAuditLogs = catchAsync(async (req: Request, res: Response) => {
  const result = await getAllAuditLogsService(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Audit logs retrieved successfully',
    data: result.auditLogs,
    meta: result.meta,
  });
});
