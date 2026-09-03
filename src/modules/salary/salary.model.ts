import { Schema, model } from 'mongoose';
import { SalaryPaymentMethod, SalaryPaymentStatus } from '../../constants';
import type { ITeacherSalaryDocument, ITeacherSalaryModel } from './salary.interface';

const teacherSalarySchema = new Schema<ITeacherSalaryDocument, ITeacherSalaryModel>(
  {
    receiptNo: {
      type: String,
      required: [true, 'Salary receipt number is required'],
      unique: true,
      trim: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: [true, 'Teacher is required'],
    },
    month: {
      type: String,
      required: [true, 'Salary month is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Salary year is required'],
    },
    fixedSalarySnapshot: {
      type: Number,
      required: [true, 'Fixed salary snapshot is required'],
      min: [0, 'Salary cannot be negative'],
    },
    bonusAmount: {
      type: Number,
      default: 0,
      min: [0, 'Bonus cannot be negative'],
    },
    deductionAmount: {
      type: Number,
      default: 0,
      min: [0, 'Deduction cannot be negative'],
    },
    netAmount: {
      type: Number,
      required: [true, 'Net salary amount is required'],
      min: [0, 'Net salary cannot be negative'],
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(SalaryPaymentMethod),
      default: SalaryPaymentMethod.CASH,
    },
    transactionRef: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(SalaryPaymentStatus),
      default: SalaryPaymentStatus.PAID,
    },
    paidBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate salary record for same teacher + month + year
teacherSalarySchema.index({ teacherId: 1, month: 1, year: 1 }, { unique: true });
teacherSalarySchema.index({ paymentDate: -1 });

export const TeacherSalary = model<ITeacherSalaryDocument, ITeacherSalaryModel>(
  'TeacherSalary',
  teacherSalarySchema
);
