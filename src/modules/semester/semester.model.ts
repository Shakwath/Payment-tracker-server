import { Schema, model } from 'mongoose';
import type { ISemesterDocument, ISemesterModel } from './semester.interface';

const semesterSchema = new Schema<ISemesterDocument, ISemesterModel>(
  {
    name: {
      type: String,
      required: [true, 'Semester name is required'],
      trim: true,
    },
    academicYear: {
      type: String,
      required: [true, 'Academic year is required'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    defaultMonthlyFee: {
      type: Number,
      required: [true, 'Default monthly fee is required'],
      min: [0, 'Fee cannot be negative'],
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ARCHIVED'],
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
  }
);

// If isCurrent is set to true, reset isCurrent for all other semesters
semesterSchema.pre('save', async function () {
  if (this.isCurrent) {
    await Semester.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isCurrent: false } }
    );
  }
});

export const Semester = model<ISemesterDocument, ISemesterModel>('Semester', semesterSchema);
