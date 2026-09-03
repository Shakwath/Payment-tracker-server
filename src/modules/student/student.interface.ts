import type { Document, Model, Types } from 'mongoose';
import { StudentStatus } from '../../constants';

export interface IStudent {
  admissionId: string;
  name: string;
  arabicName?: string;
  classProgram: string;
  rollNumber: string;
  gender: 'MALE' | 'FEMALE';
  dateOfBirth?: Date;
  admissionDate: Date;
  currentSemester: Types.ObjectId;
  guardianId: Types.ObjectId;
  monthlyFee: number;
  status: StudentStatus;
  photo?: string;
  bloodGroup?: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IStudentDocument extends IStudent, Document {}
export type IStudentModel = Model<IStudentDocument>;
