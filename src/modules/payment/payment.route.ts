import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { upload } from '../../config/multer';
import { UserRole } from '../../constants';
import {
  submitPayment,
  verifyPayment,
  getAllPayments,
  getPaymentById,
  getMyPayments,
} from './payment.controller';
import {
  verifyPaymentValidationSchema,
} from './payment.validation';

const router = Router();

router.use(authenticate);

// Guardian endpoints
router.get('/my-payments', authorize(UserRole.GUARDIAN), getMyPayments);

// Submit payment (accessible to Admin & Guardian with optional proof upload)
router.post(
  '/submit',
  authorize(UserRole.ADMIN, UserRole.GUARDIAN),
  upload.single('proof'),
  submitPayment
);

// Admin verification
router.patch(
  '/:id/verify',
  authorize(UserRole.ADMIN),
  validateRequest(verifyPaymentValidationSchema),
  verifyPayment
);

// List and view payments
router.route('/')
  .get(authorize(UserRole.ADMIN), getAllPayments);

router.route('/:id')
  .get(getPaymentById);

export const paymentRoutes = router;
