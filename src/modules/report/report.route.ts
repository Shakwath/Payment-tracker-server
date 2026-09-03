import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { UserRole } from '../../constants';
import {
  getMonthlyPaymentReport,
  getPendingPaymentReport,
  getExpenseReport,
  getFinancialSummaryReport,
  getPaymentReceiptPdf,
} from './report.controller';

const router = Router();

router.use(authenticate);

// Single payment receipt PDF (Accessible to Admin, Guardian, and Teacher)
router.get('/receipt/:paymentId/pdf', getPaymentReceiptPdf);

// Admin-only financial & operational reports
router.get('/monthly-payments', authorize(UserRole.ADMIN), getMonthlyPaymentReport);
router.get('/pending-payments', authorize(UserRole.ADMIN), getPendingPaymentReport);
router.get('/expenses', authorize(UserRole.ADMIN), getExpenseReport);
router.get('/financial-summary', authorize(UserRole.ADMIN), getFinancialSummaryReport);

export const reportRoutes = router;
