import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/apiResponse';
import {
  paySalaryService,
  getAllSalaryPaymentsService,
  getSalaryPaymentByIdService,
  getTeacherSalarySummaryService,
  getMySalaryHistoryService,
} from './salary.service';

export const paySalary = catchAsync(async (req: Request, res: Response) => {
  const currentUser = req.user!;
  const result = await paySalaryService(req.body, currentUser);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Teacher salary paid successfully',
    data: result,
  });
});

export const getAllSalaryPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await getAllSalaryPaymentsService(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Salary payments retrieved successfully',
    data: result.salaryPayments,
    meta: {
      ...result.meta,
      totalNetAmount: result.totalNetAmount,
    },
  });
});

export const getSalaryPaymentById = catchAsync(async (req: Request, res: Response) => {
  const result = await getSalaryPaymentByIdService(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Salary payment record retrieved successfully',
    data: result,
  });
});

export const getTeacherSalarySummary = catchAsync(async (req: Request, res: Response) => {
  const month = (req.query.month as string) || new Date().toLocaleString('default', { month: 'long' });
  const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();

  const result = await getTeacherSalarySummaryService(month, year);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Teacher monthly salary summary retrieved successfully',
    data: result,
  });
});

export const getMySalaryHistory = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await getMySalaryHistoryService(userId, req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Teacher salary history retrieved successfully',
    data: result.salaryPayments,
    meta: result.meta,
  });
});
