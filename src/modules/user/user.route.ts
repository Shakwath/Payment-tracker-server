import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { UserRole } from '../../constants';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  adminResetPassword,
} from './user.controller';
import {
  createUserValidationSchema,
  updateUserValidationSchema,
  resetPasswordValidationSchema,
} from './user.validation';

const router = Router();

// Protect all user routes for Admin
router.use(authenticate);
router.use(authorize(UserRole.ADMIN));

router.route('/')
  .post(validateRequest(createUserValidationSchema), createUser)
  .get(getAllUsers);

router.route('/:id')
  .get(getUserById)
  .patch(validateRequest(updateUserValidationSchema), updateUser);

router.post('/:id/reset-password', validateRequest(resetPasswordValidationSchema), adminResetPassword);

export const userRoutes = router;
