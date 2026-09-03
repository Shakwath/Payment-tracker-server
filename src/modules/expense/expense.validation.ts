import { z } from 'zod';
import { ExpenseCategory } from '../../constants';

export const createExpenseValidationSchema = z.object({
  body: z.object({
    category: z.nativeEnum(ExpenseCategory),
    title: z.string().min(2, 'Expense title is required'),
    amount: z.number().min(1, 'Amount must be greater than 0'),
    date: z.string().or(z.date()).optional(),
    month: z.string().min(1, 'Month is required'),
    year: z.number().min(2020, 'Valid year is required'),
    description: z.string().optional(),
    voucherNo: z.string().optional(),
  }),
});

export const updateExpenseValidationSchema = z.object({
  body: z.object({
    category: z.nativeEnum(ExpenseCategory).optional(),
    title: z.string().min(2).optional(),
    amount: z.number().min(1).optional(),
    date: z.string().or(z.date()).optional(),
    month: z.string().optional(),
    year: z.number().optional(),
    description: z.string().optional(),
    voucherNo: z.string().optional(),
  }),
});
