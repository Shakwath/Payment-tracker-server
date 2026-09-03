import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { UserRole } from '../../constants';
import {
  createSemester,
  getAllSemesters,
  getCurrentSemester,
  getSemesterById,
  updateSemester,
} from './semester.controller';
import {
  createSemesterValidationSchema,
  updateSemesterValidationSchema,
} from './semester.validation';

const router = Router();

router.use(authenticate);

router.get('/current', getCurrentSemester);

router.route('/')
  .post(authorize(UserRole.ADMIN), validateRequest(createSemesterValidationSchema), createSemester)
  .get(getAllSemesters);

router.route('/:id')
  .get(getSemesterById)
  .patch(authorize(UserRole.ADMIN), validateRequest(updateSemesterValidationSchema), updateSemester);

export const semesterRoutes = router;
