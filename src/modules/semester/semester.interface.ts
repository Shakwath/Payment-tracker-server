import type { Document, Model } from 'mongoose';

export interface ISemester {
  name: string;
  academicYear: string;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
  defaultMonthlyFee: number;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISemesterDocument extends ISemester, Document {}
export type ISemesterModel = Model<ISemesterDocument>;
