import { Router } from 'express';
import { validateRequest } from '../../middlewares/validate.middleware';
import { authRateLimiter } from '../../middlewares/rateLimiter.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import {
  loginUser,
  refreshToken,
  changePassword,
  getMe,
} from './auth.controller';
import {
  loginValidationSchema,
  refreshTokenValidationSchema,
  changePasswordValidationSchema,
} from './auth.validation';

const router = Router();

router.post('/login', authRateLimiter, validateRequest(loginValidationSchema), loginUser);
router.post('/refresh-token', validateRequest(refreshTokenValidationSchema), refreshToken);
router.post('/change-password', authenticate, validateRequest(changePasswordValidationSchema), changePassword);
router.get('/me', authenticate, getMe);

export const authRoutes = router;
