import { Teacher } from './teacher.model';
import { User } from '../user/user.model';
import { ApiError } from '../../utils/apiError';
import { UserRole, UserStatus } from '../../constants';
import type { ITeacher } from './teacher.interface';

const generateTeacherId = async (): Promise<string> => {
  const count = await Teacher.countDocuments();
  const nextNum = (count + 1).toString().padStart(3, '0');
  return `TCH-${nextNum}`;
};

export const createTeacherService = async (
  payload: ITeacher & { createAccount?: boolean; password?: string }
) => {
  const existing = await Teacher.findOne({ phone: payload.phone });
  if (existing) {
    throw new ApiError(400, 'Teacher with this phone number already exists');
  }

  if (!payload.teacherId) {
    payload.teacherId = await generateTeacherId();
  }

  const teacher = await Teacher.create(payload);

  if (payload.createAccount || payload.password) {
    const password = payload.password || 'teacher123456';
    const user = await User.create({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      password,
      role: UserRole.TEACHER,
      status: UserStatus.ACTIVE,
      teacherId: teacher._id,
    });

    teacher.userId = user._id;
    await teacher.save();
  }

  return teacher;
};

export const getAllTeachersService = async (query: {
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
      { teacherId: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { subjects: { $in: [new RegExp(search, 'i')] } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Teacher.countDocuments(filter);
  const teachers = await Teacher.find(filter)
    .populate('userId', 'email phone status lastLogin')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    teachers,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const getTeacherByIdService = async (id: string) => {
  const teacher = await Teacher.findById(id).populate('userId', 'email phone status lastLogin');
  if (!teacher) {
    throw new ApiError(404, 'Teacher not found');
  }
  return teacher;
};

export const getTeacherByUserIdService = async (userId: string) => {
  const teacher = await Teacher.findOne({ userId });
  if (!teacher) {
    throw new ApiError(404, 'Teacher profile not found for this account');
  }
  return teacher;
};

export const updateTeacherService = async (id: string, payload: Partial<ITeacher>) => {
  const teacher = await Teacher.findById(id);
  if (!teacher) {
    throw new ApiError(404, 'Teacher not found');
  }

  if (payload.phone && payload.phone !== teacher.phone) {
    const existing = await Teacher.findOne({ phone: payload.phone });
    if (existing) {
      throw new ApiError(400, 'Phone number is already used by another teacher');
    }
  }

  const updatedTeacher = await Teacher.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  // Sync user info if modified
  if (teacher.userId) {
    await User.findByIdAndUpdate(teacher.userId, {
      name: payload.name || teacher.name,
      phone: payload.phone || teacher.phone,
      email: payload.email || teacher.email,
    });
  }

  return updatedTeacher;
};
