import type { Document, Model, Types } from 'mongoose';
import { UserRole, UserStatus } from '../../constants';

export interface IUser {
  name: string;
  email?: string;
  phone?: string;
  password?: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  guardianId?: Types.ObjectId;
  teacherId?: Types.ObjectId;
  lastLogin?: Date;
  isPasswordResetRequired?: boolean;
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument> {
  isUserExistsByEmailOrPhone(identifier: string): Promise<IUserDocument | null>;
}
