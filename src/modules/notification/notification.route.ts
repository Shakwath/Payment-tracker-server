import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from './notification.controller';

const router = Router();

router.use(authenticate);

router.get('/my-notifications', getMyNotifications);
router.patch('/mark-all-read', markAllNotificationsAsRead);
router.patch('/:id/read', markNotificationAsRead);

export const notificationRoutes = router;
