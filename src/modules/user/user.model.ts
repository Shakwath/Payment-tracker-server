import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole, UserStatus } from '../../constants';
import type { IUserDocument, IUserModel } from './user.interface';

const userSchema = new Schema<IUserDocument, IUserModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.GUARDIAN,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
    avatar: {
      type: String,
      default: '',
    },
    guardianId: {
      type: Schema.Types.ObjectId,
      ref: 'Guardian',
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
    },
    lastLogin: {
      type: Date,
    },
    isPasswordResetRequired: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        delete ret.password;
        delete ret.refreshToken;
        return ret;
      },
    },
  }
);

// Pre-save hook to hash password
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Static helper to find by email or phone
userSchema.statics.isUserExistsByEmailOrPhone = async function (identifier: string) {
  return this.findOne({
    $or: [{ email: identifier.toLowerCase() }, { phone: identifier }],
  }).select('+password');
};

export const User = model<IUserDocument, IUserModel>('User', userSchema);
