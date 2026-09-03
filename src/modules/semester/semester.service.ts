import { Semester } from './semester.model';
import { ApiError } from '../../utils/apiError';
import type { ISemester } from './semester.interface';

export const createSemesterService = async (payload: ISemester) => {
  if (payload.isCurrent) {
    await Semester.updateMany({}, { isCurrent: false });
  }
  const semester = await Semester.create(payload);
  return semester;
};

export const getAllSemestersService = async (query: {
  status?: string;
  academicYear?: string;
  isCurrent?: string;
}) => {
  const filter: any = {};
  if (query.status) filter.status = query.status;
  if (query.academicYear) filter.academicYear = query.academicYear;
  if (query.isCurrent !== undefined) filter.isCurrent = query.isCurrent === 'true';

  const semesters = await Semester.find(filter).sort({ startDate: -1 });
  return semesters;
};

export const getCurrentSemesterService = async () => {
  const currentSemester = await Semester.findOne({ isCurrent: true, status: 'ACTIVE' });
  return currentSemester;
};

export const getSemesterByIdService = async (id: string) => {
  const semester = await Semester.findById(id);
  if (!semester) {
    throw new ApiError(404, 'Semester not found');
  }
  return semester;
};

export const updateSemesterService = async (id: string, payload: Partial<ISemester>) => {
  if (payload.isCurrent) {
    await Semester.updateMany({ _id: { $ne: id } }, { isCurrent: false });
  }

  const semester = await Semester.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!semester) {
    throw new ApiError(404, 'Semester not found');
  }

  return semester;
};
