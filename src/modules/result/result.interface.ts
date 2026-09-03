import type { Document, Model, Types } from 'mongoose';
import { ExamType } from '../../constants';

export interface IStudentResult {
  studentId: Types.ObjectId;
  semesterId: Types.ObjectId;
  examType: ExamType;
  subject: string;
  totalMarks: number;
  marksObtained: number;
  grade?: string;
  remarks?: string;
  teacherId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IStudentResultDocument extends IStudentResult, Document {}
export type IStudentResultModel = Model<IStudentResultDocument>;
