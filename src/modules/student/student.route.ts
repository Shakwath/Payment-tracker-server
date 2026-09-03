import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { UserRole } from '../../constants';
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
} from './student.controller';
import {
  createStudentValidationSchema,
  updateStudentValidationSchema,
} from './student.validation';

const router = Router();

router.use(authenticate);

router.route('/')
  .post(authorize(UserRole.ADMIN), validateRequest(createStudentValidationSchema), createStudent)
  .get(authorize(UserRole.ADMIN, UserRole.TEACHER, UserRole.GUARDIAN), getAllStudents);

router.route('/:id')
  .get(authorize(UserRole.ADMIN, UserRole.TEACHER, UserRole.GUARDIAN), getStudentById)
  .patch(authorize(UserRole.ADMIN), validateRequest(updateStudentValidationSchema), updateStudent);

export const studentRoutes = router;
