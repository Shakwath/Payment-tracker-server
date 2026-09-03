import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { UserRole } from '../../constants';
import {
  createResult,
  getAllResults,
  getStudentResults,
  updateResult,
  deleteResult,
} from './result.controller';
import {
  createStudentResultValidationSchema,
  updateStudentResultValidationSchema,
} from './result.validation';

const router = Router();

router.use(authenticate);

router.get('/student/:studentId', getStudentResults);

router.route('/')
  .post(
    authorize(UserRole.ADMIN, UserRole.TEACHER),
    validateRequest(createStudentResultValidationSchema),
    createResult
  )
  .get(getAllResults);

router.route('/:id')
  .patch(
    authorize(UserRole.ADMIN, UserRole.TEACHER),
    validateRequest(updateStudentResultValidationSchema),
    updateResult
  )
  .delete(authorize(UserRole.ADMIN), deleteResult);

export const resultRoutes = router;
