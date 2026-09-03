import { z } from 'zod';
import { SalaryPaymentMethod, SalaryPaymentStatus } from '../../constants';

export const paySalaryValidationSchema = z.object({
  body: z.object({
    teacherId: z.string().min(1, 'Teacher ID is required'),
    month: z.string().min(1, 'Salary month is required'),
    year: z.number().min(2020, 'Valid year is required'),
    bonusAmount: z.number().min(0).optional(),
    deductionAmount: z.number().min(0).optional(),
    netAmount: z.number().min(0).optional(), // Calculated on server if omitted
    paymentDate: z.string().or(z.date()).optional(),
    paymentMethod: z.nativeEnum(SalaryPaymentMethod).optional(),
    transactionRef: z.string().optional(),
    status: z.nativeEnum(SalaryPaymentStatus).optional(),
    note: z.string().optional(),
  }),
});

export const updateSalaryValidationSchema = z.object({
  body: z.object({
    bonusAmount: z.number().min(0).optional(),
    deductionAmount: z.number().min(0).optional(),
    netAmount: z.number().min(0).optional(),
    paymentDate: z.string().or(z.date()).optional(),
    paymentMethod: z.nativeEnum(SalaryPaymentMethod).optional(),
    transactionRef: z.string().optional(),
    status: z.nativeEnum(SalaryPaymentStatus).optional(),
    note: z.string().optional(),
  }),
});
