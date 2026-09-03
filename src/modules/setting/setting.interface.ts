import type { Document, Model } from 'mongoose';

export interface ISystemSetting {
  madrasaName: string;
  tagline?: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  currency: string;
  bKashNumber?: string;
  nagadNumber?: string;
  bankDetails?: {
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    branchName?: string;
    routingNumber?: string;
  };
  paymentInstructions?: string;
  defaultMonthlyFee: number;
  lateFeeRule?: {
    enabled: boolean;
    dueDayOfMonth: number;
    fineAmount: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISystemSettingDocument extends ISystemSetting, Document {}
export type ISystemSettingModel = Model<ISystemSettingDocument>;
