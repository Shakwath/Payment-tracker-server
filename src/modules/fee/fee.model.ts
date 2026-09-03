import { Schema, model } from 'mongoose';
import { FeeType } from '../../constants';
import type { IFeeConfigDocument, IFeeConfigModel } from './fee.interface';

const feeConfigSchema = new Schema<IFeeConfigDocument, IFeeConfigModel>(
  {
    title: {
      type: String,
      required: [true, 'Fee title is required'],
      trim: true,
    },
    feeType: {
      type: String,
      enum: Object.values(FeeType),
      default: FeeType.MONTHLY,
    },
    semesterId: {
      type: Schema.Types.ObjectId,
      ref: 'Semester',
      required: [true, 'Semester is required'],
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
    },
    amount: {
      type: Number,
      required: [true, 'Fee amount is required'],
      min: [0, 'Fee amount cannot be negative'],
    },
    effectiveFrom: {
      type: Date,
      default: Date.now,
    },
    effectiveTo: {
      type: Date,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const FeeConfig = model<IFeeConfigDocument, IFeeConfigModel>('FeeConfig', feeConfigSchema);
