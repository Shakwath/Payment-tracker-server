import { z } from 'zod';
import { UserRole, UserStatus } from '../../constants';

export const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email').optional(),
    phone: z.string().min(10, 'Phone must be at least 10 characters').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.nativeEnum(UserRole),
    guardianId: z.string().optional(),
    teacherId: z.string().optional(),
  }),
});

export const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(10).optional(),
    role: z.nativeEnum(UserRole).optional(),
    status: z.nativeEnum(UserStatus).optional(),
    avatar: z.string().optional(),
  }),
});

export const resetPasswordValidationSchema = z.object({
  body: z.object({
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  }),
});
