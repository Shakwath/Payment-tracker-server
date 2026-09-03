import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { UserRole } from '../../constants';
import {
  getAdminDashboard,
  getGuardianDashboard,
  getTeacherDashboard,
  getFinancialTrends,
} from './dashboard.controller';

const router = Router();

router.use(authenticate);

router.get('/admin', authorize(UserRole.ADMIN), getAdminDashboard);
router.get('/guardian', authorize(UserRole.GUARDIAN), getGuardianDashboard);
router.get('/teacher', authorize(UserRole.TEACHER), getTeacherDashboard);
router.get('/trends', authorize(UserRole.ADMIN), getFinancialTrends);

export const dashboardRoutes = router;
