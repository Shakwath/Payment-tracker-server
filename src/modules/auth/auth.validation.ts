import { z } from 'zod';
import { UserRole } from '../../constants';

export const loginValidationSchema = z.object({
  body: z.object({
    identifier: z.string().min(1, 'Email or Phone is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const registerValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address').optional(),
    phone: z.string().min(10, 'Phone must be at least 10 digits').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.nativeEnum(UserRole).optional(),
  }),
});

export const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  }),
});

export const refreshTokenValidationSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});
