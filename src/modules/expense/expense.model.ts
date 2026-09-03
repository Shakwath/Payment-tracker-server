import { Schema, model } from 'mongoose';
import { ExpenseCategory } from '../../constants';
import type { IExpenseDocument, IExpenseModel } from './expense.interface';

const expenseSchema = new Schema<IExpenseDocument, IExpenseModel>(
  {
    category: {
      type: String,
      enum: Object.values(ExpenseCategory),
      required: [true, 'Expense category is required'],
    },
    title: {
      type: String,
      required: [true, 'Expense title is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Expense amount is required'],
      min: [0, 'Expense amount cannot be negative'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    month: {
      type: String,
      required: [true, 'Expense month is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Expense year is required'],
    },
    description: {
      type: String,
      trim: true,
    },
    attachmentUrl: {
      type: String,
      default: '',
    },
    voucherNo: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

expenseSchema.index({ month: 1, year: 1, category: 1 });
expenseSchema.index({ date: -1 });

export const Expense = model<IExpenseDocument, IExpenseModel>('Expense', expenseSchema);
