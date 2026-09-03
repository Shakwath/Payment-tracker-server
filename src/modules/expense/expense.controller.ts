import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/apiResponse';
import {
  createExpenseService,
  getAllExpensesService,
  getExpenseByIdService,
  updateExpenseService,
  deleteExpenseService,
} from './expense.service';

export const createExpense = catchAsync(async (req: Request, res: Response) => {
  const currentUser = req.user!;
  let attachmentUrl = undefined;

  if (req.file) {
    attachmentUrl = `/uploads/${req.file.filename}`;
  }

  const payload = {
    ...req.body,
    amount: req.body.amount ? Number(req.body.amount) : undefined,
    year: req.body.year ? Number(req.body.year) : undefined,
  };

  const result = await createExpenseService(payload, currentUser, attachmentUrl);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Expense created successfully',
    data: result,
  });
});

export const getAllExpenses = catchAsync(async (req: Request, res: Response) => {
  const result = await getAllExpensesService(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Expenses retrieved successfully',
    data: result.expenses,
    meta: {
      ...result.meta,
      totalAmount: result.totalAmount,
    },
  });
});

export const getExpenseById = catchAsync(async (req: Request, res: Response) => {
  const result = await getExpenseByIdService(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Expense retrieved successfully',
    data: result,
  });
});

export const updateExpense = catchAsync(async (req: Request, res: Response) => {
  const currentUser = req.user!;
  let attachmentUrl = undefined;

  if (req.file) {
    attachmentUrl = `/uploads/${req.file.filename}`;
  }

  const payload = {
    ...req.body,
    amount: req.body.amount ? Number(req.body.amount) : undefined,
    year: req.body.year ? Number(req.body.year) : undefined,
  };

  const result = await updateExpenseService(
    req.params.id as string,
    payload,
    currentUser,
    attachmentUrl
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Expense updated successfully',
    data: result,
  });
});

export const deleteExpense = catchAsync(async (req: Request, res: Response) => {
  const currentUser = req.user!;
  const result = await deleteExpenseService(req.params.id as string, currentUser);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Expense deleted successfully',
    data: result,
  });
});
