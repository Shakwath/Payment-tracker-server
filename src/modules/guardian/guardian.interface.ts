import type { Document, Model, Types } from 'mongoose';

export interface IGuardian {
  userId?: Types.ObjectId;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  occupation?: string;
  relation?: string;
  nid?: string;
  avatar?: string;
  status: 'ACTIVE' | 'INACTIVE';
  students?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IGuardianDocument extends IGuardian, Document {}
export type IGuardianModel = Model<IGuardianDocument>;
