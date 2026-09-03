import { FeeConfig } from './fee.model';
import { Student } from '../student/student.model';
import { Semester } from '../semester/semester.model';
import { ApiError } from '../../utils/apiError';
import { FeeType } from '../../constants';
import type { IFeeConfig } from './fee.interface';

export const createFeeConfigService = async (payload: IFeeConfig) => {
  const semester = await Semester.findById(payload.semesterId);
  if (!semester) {
    throw new ApiError(404, 'Semester not found');
  }

  if (payload.studentId) {
    const student = await Student.findById(payload.studentId);
    if (!student) {
      throw new ApiError(404, 'Student not found');
    }
  }

  const feeConfig = await FeeConfig.create(payload);
  return feeConfig;
};

export const getAllFeeConfigsService = async (query: {
  semesterId?: string;
  studentId?: string;
  feeType?: string;
}) => {
  const filter: any = {};
  if (query.semesterId) filter.semesterId = query.semesterId;
  if (query.studentId) filter.studentId = query.studentId;
  if (query.feeType) filter.feeType = query.feeType;

  const feeConfigs = await FeeConfig.find(filter)
    .populate('semesterId', 'name academicYear isCurrent defaultMonthlyFee')
    .populate('studentId', 'name admissionId classProgram rollNumber')
    .sort({ createdAt: -1 });

  return feeConfigs;
};

export const getFeeForStudentService = async (studentId: string, semesterId: string) => {
  const student = await Student.findById(studentId);
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }

  const semester = await Semester.findById(semesterId);
  if (!semester) {
    throw new ApiError(404, 'Semester not found');
  }

  // 1. Check if there is a student-specific fee config for this semester
  const customStudentFee = await FeeConfig.findOne({
    studentId,
    semesterId,
    feeType: FeeType.MONTHLY,
  });

  if (customStudentFee) {
    return {
      monthlyFee: customStudentFee.amount,
      source: 'STUDENT_CUSTOM_FEE_CONFIG',
      description: customStudentFee.description || 'Custom student fee rate',
    };
  }

  // 2. Check student's own configured monthlyFee
  if (student.monthlyFee !== undefined && student.monthlyFee !== null) {
    return {
      monthlyFee: student.monthlyFee,
      source: 'STUDENT_PROFILE_FEE',
      description: 'Standard student profile monthly fee',
    };
  }

  // 3. Fallback to Semester's default monthly fee
  return {
    monthlyFee: semester.defaultMonthlyFee,
    source: 'SEMESTER_DEFAULT_FEE',
    description: 'Semester default monthly fee',
  };
};

export const getFeeConfigByIdService = async (id: string) => {
  const feeConfig = await FeeConfig.findById(id)
    .populate('semesterId')
    .populate('studentId');

  if (!feeConfig) {
    throw new ApiError(404, 'Fee configuration not found');
  }
  return feeConfig;
};

export const updateFeeConfigService = async (id: string, payload: Partial<IFeeConfig>) => {
  const feeConfig = await FeeConfig.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!feeConfig) {
    throw new ApiError(404, 'Fee configuration not found');
  }
  return feeConfig;
};

export const deleteFeeConfigService = async (id: string) => {
  const feeConfig = await FeeConfig.findByIdAndDelete(id);
  if (!feeConfig) {
    throw new ApiError(404, 'Fee configuration not found');
  }
  return feeConfig;
};
