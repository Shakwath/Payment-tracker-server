import { Schema, model } from 'mongoose';
import { ExamType } from '../../constants';
import type { IStudentResultDocument, IStudentResultModel } from './result.interface';

const studentResultSchema = new Schema<IStudentResultDocument, IStudentResultModel>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student is required'],
    },
    semesterId: {
      type: Schema.Types.ObjectId,
      ref: 'Semester',
      required: [true, 'Semester is required'],
    },
    examType: {
      type: String,
      enum: Object.values(ExamType),
      default: ExamType.MONTHLY_TEST,
    },
    subject: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
    },
    totalMarks: {
      type: Number,
      required: [true, 'Total marks is required'],
      min: [1, 'Total marks must be greater than 0'],
    },
    marksObtained: {
      type: Number,
      required: [true, 'Marks obtained is required'],
      min: [0, 'Marks obtained cannot be negative'],
    },
    grade: {
      type: String,
      trim: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
    },
  },
  {
    timestamps: true,
  }
);

// Auto calculate grade if not provided
studentResultSchema.pre('save', async function () {
  if (!this.grade && this.totalMarks > 0) {
    const percentage = (this.marksObtained / this.totalMarks) * 100;
    if (percentage >= 80) this.grade = 'A+';
    else if (percentage >= 70) this.grade = 'A';
    else if (percentage >= 60) this.grade = 'A-';
    else if (percentage >= 50) this.grade = 'B';
    else if (percentage >= 40) this.grade = 'C';
    else if (percentage >= 33) this.grade = 'D';
    else this.grade = 'F';
  }
});

studentResultSchema.index({ studentId: 1, semesterId: 1, examType: 1 });

export const StudentResult = model<IStudentResultDocument, IStudentResultModel>(
  'StudentResult',
  studentResultSchema
);
