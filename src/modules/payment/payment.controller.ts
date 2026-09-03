import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/apiResponse';
import {
  submitPaymentService,
  verifyPaymentService,
  getAllPaymentsService,
  getPaymentByIdService,
  getGuardianPaymentsService,
} from './payment.service';

export const submitPayment = catchAsync(async (req: Request, res: Response) => {
  const currentUser = req.user!;
  let proofUrl = undefined;

  if (req.file) {
    proofUrl = `/uploads/${req.file.filename}`;
  }

  // Parse amount and year if sent via multipart/form-data
  const payload = {
    ...req.body,
    amount: req.body.amount ? Number(req.body.amount) : undefined,
    year: req.body.year ? Number(req.body.year) : undefined,
  };

  const result = await submitPaymentService(payload, currentUser, proofUrl);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Payment submitted successfully',
    data: result,
  });
});

export const verifyPayment = catchAsync(async (req: Request, res: Response) => {
  const currentUser = req.user!;
  const result = await verifyPaymentService(
    req.params.id as string,
    currentUser,
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Payment status updated to ${result.status}`,
    data: result,
  });
});

export const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await getAllPaymentsService(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payments retrieved successfully',
    data: result.payments,
    meta: result.meta,
  });
});

export const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const result = await getPaymentByIdService(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment details retrieved successfully',
    data: result,
  });
});

export const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await getGuardianPaymentsService(userId, req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Guardian payment history retrieved successfully',
    data: result.payments,
    meta: result.meta,
  });
});
