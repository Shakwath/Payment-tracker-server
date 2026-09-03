import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { UserRole } from '../../constants';
import { getAllAuditLogs } from './audit.controller';

const router = Router();

router.use(authenticate);
router.use(authorize(UserRole.ADMIN));

router.get('/', getAllAuditLogs);

export const auditRoutes = router;
