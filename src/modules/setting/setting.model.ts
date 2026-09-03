import { Schema, model } from 'mongoose';
import type { ISystemSettingDocument, ISystemSettingModel } from './setting.interface';

const systemSettingSchema = new Schema<ISystemSettingDocument, ISystemSettingModel>(
  {
    madrasaName: {
      type: String,
      required: [true, 'Madrasa name is required'],
      default: 'Al-Madrasah Islamic Academy',
      trim: true,
    },
    tagline: {
      type: String,
      trim: true,
      default: 'Nurturing Knowledge & Faith',
    },
    address: {
      type: String,
      required: [true, 'Madrasa address is required'],
      default: 'Dhaka, Bangladesh',
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Contact phone is required'],
      default: '+8801700000000',
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      default: 'info@madrasah.edu.bd',
    },
    website: {
      type: String,
      trim: true,
    },
    logoUrl: {
      type: String,
      default: '',
    },
    currency: {
      type: String,
      default: 'BDT',
    },
    bKashNumber: {
      type: String,
      default: '01700000001 (Merchant)',
    },
    nagadNumber: {
      type: String,
      default: '01700000002 (Merchant)',
    },
    bankDetails: {
      bankName: { type: String, default: 'Islami Bank Bangladesh Ltd' },
      accountName: { type: String, default: 'Al-Madrasah Islamic Academy' },
      accountNumber: { type: String, default: '20501234567890' },
      branchName: { type: String, default: 'Main Branch' },
      routingNumber: { type: String, default: '125271234' },
    },
    paymentInstructions: {
      type: String,
      default:
        'Please send money to the provided bKash/Nagad Merchant number or deposit to our bank account. Make sure to input the correct Transaction ID/Slip reference when submitting payment.',
    },
    defaultMonthlyFee: {
      type: Number,
      default: 2000,
    },
    lateFeeRule: {
      enabled: { type: Boolean, default: false },
      dueDayOfMonth: { type: Number, default: 10 },
      fineAmount: { type: Number, default: 100 },
    },
  },
  {
    timestamps: true,
  }
);

export const SystemSetting = model<ISystemSettingDocument, ISystemSettingModel>(
  'SystemSetting',
  systemSettingSchema
);
