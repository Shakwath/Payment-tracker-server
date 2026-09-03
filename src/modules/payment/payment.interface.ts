import type { Document, Model, Types } from 'mongoose';
import { FeeType, PaymentMethod, PaymentStatus } from '../../constants';

export interface IPayment {
  receiptNo: string;
  studentId: Types.ObjectId;
  guardianId: Types.ObjectId;
  semesterId: Types.ObjectId;
  month: string;
  year: number;
  feeType: FeeType;
  amount: number;
  expectedAmount: number;
  discountAmount?: number;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  senderPhone?: string;
  bankName?: string;
  bankAccount?: string;
  bankDepositSlip?: string;
  offlineReceivedBy?: string;
  offlineReceiptNo?: string;
  paymentProof?: string;
  note?: string;
  status: PaymentStatus;
  verifiedBy?: Types.ObjectId;
  verifiedAt?: Date;
  rejectionReason?: string;
  submittedBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPaymentDocument extends IPayment, Document {}
export type IPaymentModel = Model<IPaymentDocument>;
