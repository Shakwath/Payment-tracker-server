import { StudentResult } from './result.model';
import { Student } from '../student/student.model';
import { Semester } from '../semester/semester.model';
import { Guardian } from '../guardian/guardian.model';
import { Notification } from '../notification/notification.model';
import { ApiError } from '../../utils/apiError';
import { NotificationType, UserRole } from '../../constants';
import type { IStudentResult } from './result.interface';
import type { AuthUser } from '../../middlewares/auth.middleware';

export const createResultService = async (payload: IStudentResult, currentUser: AuthUser) => {
  const student = await Student.findById(payload.studentId).populate('guardianId');
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }

  const semester = await Semester.findById(payload.semesterId);
  if (!semester) {
    throw new ApiError(404, 'Semester not found');
  }

  const teacherId = currentUser.teacherId ? (currentUser.teacherId as any) : payload.teacherId;

  const result = await StudentResult.create({
    ...payload,
    teacherId,
  });

  // Notify Guardian about new result
  const guardian = student.guardianId as any;
  if (guardian && guardian.userId) {
    await Notification.create({
      recipient: guardian.userId,
      title: 'Student Exam Result Published 📝',
      message: `Result for ${student.name} in ${result.subject} (${result.examType}): ${result.marksObtained}/${result.totalMarks} (Grade: ${result.grade || 'N/A'}).`,
      type: NotificationType.RESULT_PUBLISHED,
      link: `/guardian/students/${student._id}/results`,
      metadata: { studentId: student._id, resultId: result._id },
    });
  }

  return result;
};

export const getAllResultsService = async (query: {
  studentId?: string;
  semesterId?: string;
  examType?: string;
  subject?: string;
}) => {
  const filter: any = {};
  if (query.studentId) filter.studentId = query.studentId;
  if (query.semesterId) filter.semesterId = query.semesterId;
  if (query.examType) filter.examType = query.examType;
  if (query.subject) filter.subject = { $regex: query.subject, $options: 'i' };

  const results = await StudentResult.find(filter)
    .populate('studentId', 'name admissionId rollNumber classProgram')
    .populate('semesterId', 'name academicYear')
    .populate('teacherId', 'name teacherId subjects')
    .sort({ createdAt: -1 });

  return results;
};

export const getResultsForStudentService = async (studentId: string, semesterId?: string) => {
  const filter: any = { studentId };
  if (semesterId) filter.semesterId = semesterId;

  const results = await StudentResult.find(filter)
    .populate('semesterId', 'name academicYear isCurrent')
    .populate('teacherId', 'name subjects')
    .sort({ createdAt: -1 });

  return results;
};

export const updateResultService = async (id: string, payload: Partial<IStudentResult>) => {
  const result = await StudentResult.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new ApiError(404, 'Result not found');
  }

  return result;
};

export const deleteResultService = async (id: string) => {
  const result = await StudentResult.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(404, 'Result not found');
  }
  return result;
};
