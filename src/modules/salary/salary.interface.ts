import type { Document, Model, Types } from 'mongoose';
import { SalaryPaymentMethod, SalaryPaymentStatus } from '../../constants';

export interface ITeacherSalary {
  receiptNo: string;
  teacherId: Types.ObjectId;
  month: string;
  year: number;
  fixedSalarySnapshot: number;
  bonusAmount?: number;
  deductionAmount?: number;
  netAmount: number;
  paymentDate: Date;
  paymentMethod: SalaryPaymentMethod;
  transactionRef?: string;
  status: SalaryPaymentStatus;
  paidBy: Types.ObjectId;
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITeacherSalaryDocument extends ITeacherSalary, Document {}
export type ITeacherSalaryModel = Model<ITeacherSalaryDocument>;
