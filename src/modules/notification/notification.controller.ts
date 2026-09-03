import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/apiResponse';
import {
  getMyNotificationsService,
  markNotificationAsReadService,
  markAllNotificationsAsReadService,
} from './notification.service';

export const getMyNotifications = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await getMyNotificationsService(userId, req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Notifications retrieved successfully',
    data: result.notifications,
    meta: {
      ...result.meta,
      unreadCount: result.unreadCount,
    },
  });
});

export const markNotificationAsRead = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await markNotificationAsReadService(req.params.id as string, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Notification marked as read',
    data: result,
  });
});

export const markAllNotificationsAsRead = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await markAllNotificationsAsReadService(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: null,
  });
});
