import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/apiResponse';
import {
  getMonthlyPaymentReportService,
  getPendingPaymentReportService,
  getExpenseReportService,
} from './report.service';
import { getAdminDashboardSummaryService } from '../dashboard/dashboard.service';
import { getPaymentByIdService } from '../payment/payment.service';
import { getSystemSettingsService } from '../setting/setting.service';
import {
  generatePaymentReceiptPdf,
  generateFinancialStatementPdf,
} from '../../utils/pdfGenerator';

export const getMonthlyPaymentReport = catchAsync(async (req: Request, res: Response) => {
  const month = (req.query.month as string) || new Date().toLocaleString('default', { month: 'long' });
  const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();
  const semesterId = req.query.semesterId as string | undefined;

  const result = await getMonthlyPaymentReportService({ month, year, semesterId });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Monthly payment report retrieved successfully',
    data: result,
  });
});

export const getPendingPaymentReport = catchAsync(async (req: Request, res: Response) => {
  const month = (req.query.month as string) || new Date().toLocaleString('default', { month: 'long' });
  const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();
  const semesterId = req.query.semesterId as string | undefined;

  const result = await getPendingPaymentReportService({ month, year, semesterId });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Pending payment report retrieved successfully',
    data: result,
  });
});

export const getExpenseReport = catchAsync(async (req: Request, res: Response) => {
  const month = req.query.month as string | undefined;
  const year = req.query.year ? Number(req.query.year) : undefined;
  const category = req.query.category as string | undefined;

  const result = await getExpenseReportService({ month, year, category });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Expense report retrieved successfully',
    data: result,
  });
});

export const getFinancialSummaryReport = catchAsync(async (req: Request, res: Response) => {
  const month = (req.query.month as string) || new Date().toLocaleString('default', { month: 'long' });
  const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();
  const semesterId = req.query.semesterId as string | undefined;
  const format = req.query.format as string | undefined;

  const summary = await getAdminDashboardSummaryService({ month, year, semesterId });
  const settings = await getSystemSettingsService();

  if (format === 'pdf') {
    return generateFinancialStatementPdf(res, summary, settings);
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Financial summary report retrieved successfully',
    data: summary,
  });
});

export const getPaymentReceiptPdf = catchAsync(async (req: Request, res: Response) => {
  const paymentId = req.params.paymentId as string;
  const payment = await getPaymentByIdService(paymentId);
  const settings = await getSystemSettingsService();

  generatePaymentReceiptPdf(res, payment, settings);
});
