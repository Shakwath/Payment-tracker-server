import { Guardian } from './guardian.model';
import { User } from '../user/user.model';
import { ApiError } from '../../utils/apiError';
import { UserRole, UserStatus } from '../../constants';
import type { IGuardian } from './guardian.interface';

export const createGuardianService = async (payload: IGuardian & { createAccount?: boolean; password?: string }) => {
  const existingGuardian = await Guardian.findOne({ phone: payload.phone });
  if (existingGuardian) {
    throw new ApiError(400, 'A guardian with this phone number already exists');
  }

  const guardian = await Guardian.create(payload);

  if (payload.createAccount || payload.password) {
    const password = payload.password || 'guardian123456';
    const user = await User.create({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      password,
      role: UserRole.GUARDIAN,
      status: UserStatus.ACTIVE,
      guardianId: guardian._id,
    });

    guardian.userId = user._id;
    await guardian.save();
  }

  return guardian;
};

export const getAllGuardiansService = async (query: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const { search, status, page = 1, limit = 10 } = query;
  const filter: any = {};

  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { nid: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Guardian.countDocuments(filter);
  const guardians = await Guardian.find(filter)
    .populate('students')
    .populate('userId', 'email phone status lastLogin')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    guardians,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const getGuardianByIdService = async (id: string) => {
  const guardian = await Guardian.findById(id)
    .populate({
      path: 'students',
      populate: { path: 'currentSemester' },
    })
    .populate('userId', 'email phone status lastLogin');

  if (!guardian) {
    throw new ApiError(404, 'Guardian not found');
  }
  return guardian;
};

export const getGuardianByUserIdService = async (userId: string) => {
  const guardian = await Guardian.findOne({ userId })
    .populate({
      path: 'students',
      populate: { path: 'currentSemester' },
    });

  if (!guardian) {
    throw new ApiError(404, 'Guardian profile not found for this account');
  }
  return guardian;
};

export const updateGuardianService = async (id: string, payload: Partial<IGuardian>) => {
  const guardian = await Guardian.findById(id);
  if (!guardian) {
    throw new ApiError(404, 'Guardian not found');
  }

  if (payload.phone && payload.phone !== guardian.phone) {
    const existing = await Guardian.findOne({ phone: payload.phone });
    if (existing) {
      throw new ApiError(400, 'Phone number is already used by another guardian');
    }
  }

  const updatedGuardian = await Guardian.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  // Sync User name/phone/email if exists
  if (guardian.userId) {
    await User.findByIdAndUpdate(guardian.userId, {
      name: payload.name || guardian.name,
      phone: payload.phone || guardian.phone,
      email: payload.email || guardian.email,
    });
  }

  return updatedGuardian;
};
