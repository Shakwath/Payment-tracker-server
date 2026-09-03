import { z } from 'zod';
import { FeeType } from '../../constants';

export const createFeeConfigValidationSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Fee title is required'),
    feeType: z.nativeEnum(FeeType),
    semesterId: z.string().min(1, 'Semester ID is required'),
    studentId: z.string().optional(),
    amount: z.number().min(0, 'Amount must be 0 or more'),
    effectiveFrom: z.string().or(z.date()).optional(),
    effectiveTo: z.string().or(z.date()).optional(),
    description: z.string().optional(),
  }),
});

export const updateFeeConfigValidationSchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    feeType: z.nativeEnum(FeeType).optional(),
    semesterId: z.string().optional(),
    studentId: z.string().optional(),
    amount: z.number().min(0).optional(),
    effectiveFrom: z.string().or(z.date()).optional(),
    effectiveTo: z.string().or(z.date()).optional(),
    description: z.string().optional(),
  }),
});
