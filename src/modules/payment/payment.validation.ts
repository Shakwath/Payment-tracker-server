import { z } from 'zod';
import { FeeType, PaymentMethod, PaymentStatus } from '../../constants';

export const submitPaymentValidationSchema = z.object({
  body: z.object({
    studentId: z.string().min(1, 'Student ID is required'),
    semesterId: z.string().min(1, 'Semester ID is required'),
    month: z.string().min(1, 'Payment month is required'),
    year: z.number().min(2020, 'Valid year is required'),
    feeType: z.nativeEnum(FeeType).optional(),
    amount: z.number().min(1, 'Amount must be greater than 0'),
    paymentMethod: z.nativeEnum(PaymentMethod),
    transactionId: z.string().optional(),
    senderPhone: z.string().optional(),
    bankName: z.string().optional(),
    bankAccount: z.string().optional(),
    offlineReceivedBy: z.string().optional(),
    offlineReceiptNo: z.string().optional(),
    note: z.string().optional(),
  }),
});

export const verifyPaymentValidationSchema = z.object({
  body: z.object({
    status: z.enum([PaymentStatus.VERIFIED, PaymentStatus.REJECTED, PaymentStatus.CANCELLED, PaymentStatus.REFUNDED]),
    rejectionReason: z.string().optional(),
    note: z.string().optional(),
  }),
});

export const updatePaymentValidationSchema = z.object({
  body: z.object({
    amount: z.number().min(1).optional(),
    paymentMethod: z.nativeEnum(PaymentMethod).optional(),
    transactionId: z.string().optional(),
    senderPhone: z.string().optional(),
    bankName: z.string().optional(),
    bankAccount: z.string().optional(),
    offlineReceivedBy: z.string().optional(),
    offlineReceiptNo: z.string().optional(),
    note: z.string().optional(),
    status: z.nativeEnum(PaymentStatus).optional(),
  }),
});
