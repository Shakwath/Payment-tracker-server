import { z } from 'zod';

export const createGuardianValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Guardian name is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
    email: z.string().email('Invalid email').optional(),
    address: z.string().optional(),
    occupation: z.string().optional(),
    relation: z.string().optional(),
    nid: z.string().optional(),
    avatar: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    createAccount: z.boolean().optional(),
    password: z.string().min(6).optional(),
  }),
});

export const updateGuardianValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    phone: z.string().min(10).optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
    occupation: z.string().optional(),
    relation: z.string().optional(),
    nid: z.string().optional(),
    avatar: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  }),
});
