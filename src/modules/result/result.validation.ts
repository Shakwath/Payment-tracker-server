import { z } from 'zod';
import { ExamType } from '../../constants';

export const createStudentResultValidationSchema = z.object({
  body: z.object({
    studentId: z.string().min(1, 'Student ID is required'),
    semesterId: z.string().min(1, 'Semester ID is required'),
    examType: z.nativeEnum(ExamType).optional(),
    subject: z.string().min(1, 'Subject is required'),
    totalMarks: z.number().min(1, 'Total marks must be at least 1'),
    marksObtained: z.number().min(0, 'Marks obtained must be 0 or more'),
    grade: z.string().optional(),
    remarks: z.string().optional(),
    teacherId: z.string().optional(),
  }),
});

export const updateStudentResultValidationSchema = z.object({
  body: z.object({
    subject: z.string().min(1).optional(),
    examType: z.nativeEnum(ExamType).optional(),
    totalMarks: z.number().min(1).optional(),
    marksObtained: z.number().min(0).optional(),
    grade: z.string().optional(),
    remarks: z.string().optional(),
  }),
});
