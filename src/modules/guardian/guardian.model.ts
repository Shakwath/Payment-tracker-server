import { Schema, model } from 'mongoose';
import type { IGuardianDocument, IGuardianModel } from './guardian.interface';

const guardianSchema = new Schema<IGuardianDocument, IGuardianModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Guardian name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Guardian phone number is required'],
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
    occupation: {
      type: String,
      trim: true,
    },
    relation: {
      type: String,
      default: 'Father',
    },
    nid: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Guardian = model<IGuardianDocument, IGuardianModel>('Guardian', guardianSchema);
