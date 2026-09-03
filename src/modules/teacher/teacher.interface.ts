import type { Document, Model, Types } from 'mongoose';

export interface ITeacher {
  teacherId: string;
  userId?: Types.ObjectId;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  subjects: string[];
  fixedMonthlySalary: number;
  joiningDate: Date;
  status: 'ACTIVE' | 'INACTIVE';
  avatar?: string;
  education?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITeacherDocument extends ITeacher, Document {}
export type ITeacherModel = Model<ITeacherDocument>;
