import type { Document, Model, Types } from 'mongoose';
import { ExpenseCategory } from '../../constants';

export interface IExpense {
  category: ExpenseCategory;
  title: string;
  amount: number;
  date: Date;
  month: string;
  year: number;
  description?: string;
  attachmentUrl?: string;
  voucherNo?: string;
  createdBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IExpenseDocument extends IExpense, Document {}
export type IExpenseModel = Model<IExpenseDocument>;
