import { z } from 'zod';

export const createSemesterValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Semester name is required'),
    academicYear: z.string().min(4, 'Academic year is required (e.g. 2026)'),
    startDate: z.string().or(z.date()),
    endDate: z.string().or(z.date()),
    isCurrent: z.boolean().optional(),
    defaultMonthlyFee: z.number().min(0, 'Default monthly fee must be 0 or more'),
    status: z.enum(['ACTIVE', 'ARCHIVED']).optional(),
  }),
});

export const updateSemesterValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    academicYear: z.string().optional(),
    startDate: z.string().or(z.date()).optional(),
    endDate: z.string().or(z.date()).optional(),
    isCurrent: z.boolean().optional(),
    defaultMonthlyFee: z.number().min(0).optional(),
    status: z.enum(['ACTIVE', 'ARCHIVED']).optional(),
  }),
});
