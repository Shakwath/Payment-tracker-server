import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/apiResponse';
import {
  getSystemSettingsService,
  updateSystemSettingsService,
} from './setting.service';

export const getSystemSettings = catchAsync(async (_req: Request, res: Response) => {
  const result = await getSystemSettingsService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'System settings retrieved successfully',
    data: result,
  });
});

export const updateSystemSettings = catchAsync(async (req: Request, res: Response) => {
  const currentUser = req.user!;
  let logoUrl = undefined;

  if (req.file) {
    logoUrl = `/uploads/${req.file.filename}`;
  }

  const result = await updateSystemSettingsService(req.body, currentUser, logoUrl);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'System settings updated successfully',
    data: result,
  });
});
