import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { UserRole } from '../../constants';
import {
  createFeeConfig,
  getAllFeeConfigs,
  getFeeForStudent,
  getFeeConfigById,
  updateFeeConfig,
  deleteFeeConfig,
} from './fee.controller';
import {
  createFeeConfigValidationSchema,
  updateFeeConfigValidationSchema,
} from './fee.validation';

const router = Router();

router.use(authenticate);

router.get('/student/:studentId/semester/:semesterId', getFeeForStudent);

router.route('/')
  .post(authorize(UserRole.ADMIN), validateRequest(createFeeConfigValidationSchema), createFeeConfig)
  .get(getAllFeeConfigs);

router.route('/:id')
  .get(getFeeConfigById)
  .patch(authorize(UserRole.ADMIN), validateRequest(updateFeeConfigValidationSchema), updateFeeConfig)
  .delete(authorize(UserRole.ADMIN), deleteFeeConfig);

export const feeRoutes = router;
