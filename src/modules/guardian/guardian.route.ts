import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { UserRole } from '../../constants';
import {
  createGuardian,
  getAllGuardians,
  getGuardianById,
  getMyGuardianProfile,
  updateGuardian,
} from './guardian.controller';
import {
  createGuardianValidationSchema,
  updateGuardianValidationSchema,
} from './guardian.validation';

const router = Router();

router.use(authenticate);

// Guardian self route
router.get('/me', authorize(UserRole.GUARDIAN), getMyGuardianProfile);

// Admin routes
router.route('/')
  .post(authorize(UserRole.ADMIN), validateRequest(createGuardianValidationSchema), createGuardian)
  .get(authorize(UserRole.ADMIN), getAllGuardians);

router.route('/:id')
  .get(authorize(UserRole.ADMIN, UserRole.GUARDIAN), getGuardianById)
  .patch(authorize(UserRole.ADMIN), validateRequest(updateGuardianValidationSchema), updateGuardian);

export const guardianRoutes = router;
