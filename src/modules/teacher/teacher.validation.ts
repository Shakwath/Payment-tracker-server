import { z } from 'zod';

export const createTeacherValidationSchema = z.object({
  body: z.object({
    teacherId: z.string().optional(), // Auto generated if not provided
    name: z.string().min(2, 'Teacher name is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
    email: z.string().email('Invalid email').optional(),
    address: z.string().optional(),
    subjects: z.array(z.string()).optional(),
    fixedMonthlySalary: z.number().min(0, 'Monthly salary must be 0 or more'),
    joiningDate: z.string().or(z.date()).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    avatar: z.string().optional(),
    education: z.string().optional(),
    createAccount: z.boolean().optional(),
    password: z.string().min(6).optional(),
  }),
});

export const updateTeacherValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    phone: z.string().min(10).optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
    subjects: z.array(z.string()).optional(),
    fixedMonthlySalary: z.number().min(0).optional(),
    joiningDate: z.string().or(z.date()).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    avatar: z.string().optional(),
    education: z.string().optional(),
  }),
});
