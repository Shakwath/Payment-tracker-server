import { z } from 'zod';
import { StudentStatus } from '../../constants';

export const createStudentValidationSchema = z.object({
  body: z.object({
    admissionId: z.string().min(1).optional(), // Can be auto-generated if omitted
    name: z.string().min(2, 'Student name is required'),
    arabicName: z.string().optional(),
    classProgram: z.string().min(1, 'Class/Program is required'),
    rollNumber: z.string().min(1, 'Roll number is required'),
    gender: z.enum(['MALE', 'FEMALE']).optional(),
    dateOfBirth: z.string().or(z.date()).optional(),
    admissionDate: z.string().or(z.date()).optional(),
    currentSemester: z.string().min(1, 'Current semester ID is required'),
    guardianId: z.string().min(1, 'Guardian ID is required'),
    monthlyFee: z.number().min(0, 'Monthly fee must be 0 or greater'),
    status: z.nativeEnum(StudentStatus).optional(),
    photo: z.string().optional(),
    bloodGroup: z.string().optional(),
    address: z.string().optional(),
  }),
});

export const updateStudentValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    arabicName: z.string().optional(),
    classProgram: z.string().optional(),
    rollNumber: z.string().optional(),
    gender: z.enum(['MALE', 'FEMALE']).optional(),
    dateOfBirth: z.string().or(z.date()).optional(),
    admissionDate: z.string().or(z.date()).optional(),
    currentSemester: z.string().optional(),
    guardianId: z.string().optional(),
    monthlyFee: z.number().min(0).optional(),
    status: z.nativeEnum(StudentStatus).optional(),
    photo: z.string().optional(),
    bloodGroup: z.string().optional(),
    address: z.string().optional(),
  }),
});
