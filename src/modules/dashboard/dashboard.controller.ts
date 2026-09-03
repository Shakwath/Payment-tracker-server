import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/apiResponse';
import {
  getAdminDashboardSummaryService,
  getGuardianDashboardSummaryService,
  getTeacherDashboardSummaryService,
  getFinancialTrendsService,
} from './dashboard.service';

export const getAdminDashboard = catchAsync(async (req: Request, res: Response) => {
  const month = req.query.month as string | undefined;
  const year = req.query.year ? Number(req.query.year) : undefined;
  const semesterId = req.query.semesterId as string | undefined;

  const result = await getAdminDashboardSummaryService({ month, year, semesterId });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin dashboard summary retrieved successfully',
    data: result,
  });
});

export const getGuardianDashboard = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await getGuardianDashboardSummaryService(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Guardian dashboard summary retrieved successfully',
    data: result,
  });
});

export const getTeacherDashboard = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await getTeacherDashboardSummaryService(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Teacher dashboard summary retrieved successfully',
    data: result,
  });
});

export const getFinancialTrends = catchAsync(async (req: Request, res: Response) => {
  const year = req.query.year ? Number(req.query.year) : undefined;
  const result = await getFinancialTrendsService(year);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Financial trends retrieved successfully',
    data: result,
  });
});
