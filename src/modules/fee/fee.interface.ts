import type { Document, Model, Types } from 'mongoose';
import { FeeType } from '../../constants';

export interface IFeeConfig {
  title: string;
  feeType: FeeType;
  semesterId: Types.ObjectId;
  studentId?: Types.ObjectId;
  amount: number;
  effectiveFrom: Date;
  effectiveTo?: Date;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFeeConfigDocument extends IFeeConfig, Document {}
export type IFeeConfigModel = Model<IFeeConfigDocument>;
