import { Schema, model } from 'mongoose';
import { StudentStatus } from '../../constants';
import type { IStudentDocument, IStudentModel } from './student.interface';

const studentSchema = new Schema<IStudentDocument, IStudentModel>(
  {
    admissionId: {
      type: String,
      required: [true, 'Admission ID is required'],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    arabicName: {
      type: String,
      trim: true,
    },
    classProgram: {
      type: String,
      required: [true, 'Class/Program is required'],
      trim: true,
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      trim: true,
    },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE'],
      default: 'MALE',
    },
    dateOfBirth: {
      type: Date,
    },
    admissionDate: {
      type: Date,
      default: Date.now,
    },
    currentSemester: {
      type: Schema.Types.ObjectId,
      ref: 'Semester',
      required: [true, 'Current semester is required'],
    },
    guardianId: {
      type: Schema.Types.ObjectId,
      ref: 'Guardian',
      required: [true, 'Guardian is required'],
    },
    monthlyFee: {
      type: Number,
      required: [true, 'Monthly fee amount is required'],
      min: [0, 'Monthly fee cannot be negative'],
    },
    status: {
      type: String,
      enum: Object.values(StudentStatus),
      default: StudentStatus.ACTIVE,
    },
    photo: {
      type: String,
      default: '',
    },
    bloodGroup: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Student = model<IStudentDocument, IStudentModel>('Student', studentSchema);
