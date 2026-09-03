import { Schema, model } from 'mongoose';
import type { ITeacherDocument, ITeacherModel } from './teacher.interface';

const teacherSchema = new Schema<ITeacherDocument, ITeacherModel>(
  {
    teacherId: {
      type: String,
      required: [true, 'Teacher ID is required'],
      unique: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Teacher name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      trim: true,
    },
    subjects: {
      type: [String],
      default: [],
    },
    fixedMonthlySalary: {
      type: Number,
      required: [true, 'Fixed monthly salary is required'],
      min: [0, 'Salary cannot be negative'],
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
    avatar: {
      type: String,
      default: '',
    },
    education: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

teacherSchema.index({ phone: 1 });
teacherSchema.index({ status: 1 });

export const Teacher = model<ITeacherDocument, ITeacherModel>('Teacher', teacherSchema);
