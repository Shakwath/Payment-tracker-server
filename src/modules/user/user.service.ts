import { User } from './user.model';
import { ApiError } from '../../utils/apiError';
import type { IUser } from './user.interface';

export const createUserService = async (payload: IUser) => {
  if (payload.email) {
    const existingEmail = await User.findOne({ email: payload.email.toLowerCase() });
    if (existingEmail) {
      throw new ApiError(400, 'User with this email already exists');
    }
  }

  if (payload.phone) {
    const existingPhone = await User.findOne({ phone: payload.phone });
    if (existingPhone) {
      throw new ApiError(400, 'User with this phone already exists');
    }
  }

  const user = await User.create(payload);
  return user;
};

export const getAllUsersService = async (query: {
  role?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const { role, status, search, page = 1, limit = 10 } = query;
  const filter: any = {};

  if (role) filter.role = role;
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .populate('guardianId')
    .populate('teacherId')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    users,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const getUserByIdService = async (id: string) => {
  const user = await User.findById(id).populate('guardianId').populate('teacherId');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

export const updateUserService = async (id: string, payload: Partial<IUser>) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Check email uniqueness if modified
  if (payload.email && payload.email !== user.email) {
    const existing = await User.findOne({ email: payload.email.toLowerCase() });
    if (existing) {
      throw new ApiError(400, 'Email is already taken by another user');
    }
  }

  // Check phone uniqueness if modified
  if (payload.phone && payload.phone !== user.phone) {
    const existing = await User.findOne({ phone: payload.phone });
    if (existing) {
      throw new ApiError(400, 'Phone is already taken by another user');
    }
  }

  const updatedUser = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedUser;
};

export const adminResetPasswordService = async (id: string, newPassword: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.password = newPassword;
  user.isPasswordResetRequired = true;
  await user.save();

  return { message: 'User password reset successfully' };
};
