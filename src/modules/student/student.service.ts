import { Student } from './student.model';
import { Guardian } from '../guardian/guardian.model';
import { Semester } from '../semester/semester.model';
import { ApiError } from '../../utils/apiError';
import type { IStudent } from './student.interface';

const generateAdmissionId = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const count = await Student.countDocuments();
  const nextNum = (count + 1).toString().padStart(4, '0');
  return `STU-${year}-${nextNum}`;
};

export const createStudentService = async (payload: IStudent) => {
  // Validate Guardian
  const guardian = await Guardian.findById(payload.guardianId);
  if (!guardian) {
    throw new ApiError(404, 'Guardian not found');
  }

  // Validate Semester
  const semester = await Semester.findById(payload.currentSemester);
  if (!semester) {
    throw new ApiError(404, 'Semester not found');
  }

  // Auto generate admission ID if not provided
  if (!payload.admissionId) {
    payload.admissionId = await generateAdmissionId();
  } else {
    const existing = await Student.findOne({ admissionId: payload.admissionId });
    if (existing) {
      throw new ApiError(400, 'Student with this Admission ID already exists');
    }
  }

  const student = await Student.create(payload);

  // Link student to guardian
  if (!guardian.students?.includes(student._id)) {
    guardian.students = guardian.students || [];
    guardian.students.push(student._id);
    await guardian.save();
  }

  return student;
};

export const getAllStudentsService = async (query: {
  search?: string;
  semesterId?: string;
  classProgram?: string;
  status?: string;
  guardianId?: string;
  page?: number;
  limit?: number;
}) => {
  const { search, semesterId, classProgram, status, guardianId, page = 1, limit = 10 } = query;
  const filter: any = {};

  if (semesterId) filter.currentSemester = semesterId;
  if (classProgram) filter.classProgram = classProgram;
  if (status) filter.status = status;
  if (guardianId) filter.guardianId = guardianId;

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { admissionId: { $regex: search, $options: 'i' } },
      { rollNumber: { $regex: search, $options: 'i' } },
      { classProgram: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Student.countDocuments(filter);
  const students = await Student.find(filter)
    .populate('currentSemester', 'name academicYear isCurrent defaultMonthlyFee')
    .populate('guardianId', 'name phone email relation address')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    students,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const getStudentByIdService = async (id: string) => {
  const student = await Student.findById(id)
    .populate('currentSemester')
    .populate('guardianId');

  if (!student) {
    throw new ApiError(404, 'Student not found');
  }
  return student;
};

export const updateStudentService = async (id: string, payload: Partial<IStudent>) => {
  const student = await Student.findById(id);
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }

  // If guardian changed, update both old and new guardian linked students list
  if (payload.guardianId && payload.guardianId.toString() !== student.guardianId.toString()) {
    await Guardian.findByIdAndUpdate(student.guardianId, {
      $pull: { students: student._id },
    });
    await Guardian.findByIdAndUpdate(payload.guardianId, {
      $addToSet: { students: student._id },
    });
  }

  const updatedStudent = await Student.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
    .populate('currentSemester')
    .populate('guardianId');

  return updatedStudent;
};
