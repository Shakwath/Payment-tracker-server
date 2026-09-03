import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { upload } from '../../config/multer';
import { UserRole } from '../../constants';
import {
  getSystemSettings,
  updateSystemSettings,
} from './setting.controller';
import { updateSettingValidationSchema } from './setting.validation';

const router = Router();

// Public / Authenticated read
router.get('/', getSystemSettings);

// Admin update
router.patch(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  upload.single('logo'),
  validateRequest(updateSettingValidationSchema),
  updateSystemSettings
);

export const settingRoutes = router;
