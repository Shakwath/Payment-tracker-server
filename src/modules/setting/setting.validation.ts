import { z } from 'zod';

export const updateSettingValidationSchema = z.object({
  body: z.object({
    madrasaName: z.string().min(2).optional(),
    tagline: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    website: z.string().optional(),
    logoUrl: z.string().optional(),
    currency: z.string().optional(),
    bKashNumber: z.string().optional(),
    nagadNumber: z.string().optional(),
    bankDetails: z.object({
      bankName: z.string().optional(),
      accountName: z.string().optional(),
      accountNumber: z.string().optional(),
      branchName: z.string().optional(),
      routingNumber: z.string().optional(),
    }).optional(),
    paymentInstructions: z.string().optional(),
    defaultMonthlyFee: z.number().min(0).optional(),
    lateFeeRule: z.object({
      enabled: z.boolean().optional(),
      dueDayOfMonth: z.number().min(1).max(31).optional(),
      fineAmount: z.number().min(0).optional(),
    }).optional(),
  }),
});
