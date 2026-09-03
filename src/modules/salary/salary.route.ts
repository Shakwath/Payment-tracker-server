import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { UserRole } from '../../constants';
import {
  paySalary,
  getAllSalaryPayments,
  getSalaryPaymentById,
  getTeacherSalarySummary,
  getMySalaryHistory,
} from './salary.controller';
import { paySalaryValidationSchema } from './salary.validation';

const router = Router();

router.use(authenticate);

// Teacher's own history
router.get('/my-salary', authorize(UserRole.TEACHER), getMySalaryHistory);

// Admin endpoints
router.get('/summary', authorize(UserRole.ADMIN), getTeacherSalarySummary);

router.route('/')
  .post(authorize(UserRole.ADMIN), validateRequest(paySalaryValidationSchema), paySalary)
  .get(authorize(UserRole.ADMIN), getAllSalaryPayments);

router.route('/:id')
  .get(authorize(UserRole.ADMIN, UserRole.TEACHER), getSalaryPaymentById);

export const salaryRoutes = router;
