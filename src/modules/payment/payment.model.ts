import { Schema, model } from 'mongoose';
import { FeeType, PaymentMethod, PaymentStatus } from '../../constants';
import type { IPaymentDocument, IPaymentModel } from './payment.interface';

const paymentSchema = new Schema<IPaymentDocument, IPaymentModel>(
  {
    receiptNo: {
      type: String,
      required: [true, 'Receipt number is required'],
      unique: true,
      trim: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student is required'],
    },
    guardianId: {
      type: Schema.Types.ObjectId,
      ref: 'Guardian',
      required: [true, 'Guardian is required'],
    },
    semesterId: {
      type: Schema.Types.ObjectId,
      ref: 'Semester',
      required: [true, 'Semester is required'],
    },
    month: {
      type: String,
      required: [true, 'Payment month is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Payment year is required'],
    },
    feeType: {
      type: String,
      enum: Object.values(FeeType),
      default: FeeType.MONTHLY,
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    expectedAmount: {
      type: Number,
      required: [true, 'Expected amount snapshot is required'],
      min: [0, 'Expected amount cannot be negative'],
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: [true, 'Payment method is required'],
    },
    transactionId: {
      type: String,
      trim: true,
    },
    senderPhone: {
      type: String,
      trim: true,
    },
    bankName: {
      type: String,
      trim: true,
    },
    bankAccount: {
      type: String,
      trim: true,
    },
    bankDepositSlip: {
      type: String,
      default: '',
    },
    offlineReceivedBy: {
      type: String,
      trim: true,
    },
    offlineReceiptNo: {
      type: String,
      trim: true,
    },
    paymentProof: {
      type: String,
      default: '',
    },
    note: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Submitted by user is required'],
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ studentId: 1, semesterId: 1, month: 1, year: 1, feeType: 1, status: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ createdAt: -1 });

export const Payment = model<IPaymentDocument, IPaymentModel>('Payment', paymentSchema);
