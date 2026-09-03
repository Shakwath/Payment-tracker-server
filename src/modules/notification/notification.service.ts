import { Notification } from './notification.model';
import { ApiError } from '../../utils/apiError';

export const getMyNotificationsService = async (
  userId: string,
  query: { page?: number; limit?: number; unreadOnly?: string }
) => {
  const { page = 1, limit = 20, unreadOnly } = query;
  const filter: any = { recipient: userId };

  if (unreadOnly === 'true') {
    filter.readStatus = false;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Notification.countDocuments(filter);
  const unreadCount = await Notification.countDocuments({ recipient: userId, readStatus: false });

  const notifications = await Notification.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    notifications,
    unreadCount,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const markNotificationAsReadService = async (id: string, userId: string) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: id, recipient: userId },
    { readStatus: true },
    { new: true }
  );

  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  return notification;
};

export const markAllNotificationsAsReadService = async (userId: string) => {
  await Notification.updateMany({ recipient: userId, readStatus: false }, { readStatus: true });
  return { message: 'All notifications marked as read' };
};
