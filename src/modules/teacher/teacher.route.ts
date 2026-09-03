import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { UserRole } from '../../constants';
import {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  getMyTeacherProfile,
  updateTeacher,
} from './teacher.controller';
import {
  createTeacherValidationSchema,
  updateTeacherValidationSchema,
} from './teacher.validation';

const router = Router();

router.use(authenticate);

// Teacher portal self route
router.get('/me', authorize(UserRole.TEACHER), getMyTeacherProfile);

// Admin routes
router.route('/')
  .post(authorize(UserRole.ADMIN), validateRequest(createTeacherValidationSchema), createTeacher)
  .get(authorize(UserRole.ADMIN), getAllTeachers);

router.route('/:id')
  .get(authorize(UserRole.ADMIN, UserRole.TEACHER), getTeacherById)
  .patch(authorize(UserRole.ADMIN), validateRequest(updateTeacherValidationSchema), updateTeacher);

export const teacherRoutes = router;
