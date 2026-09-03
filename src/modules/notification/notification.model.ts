import { Schema, model } from 'mongoose';
import { NotificationType } from '../../constants';
import type { INotificationDocument, INotificationModel } from './notification.interface';

const notificationSchema = new Schema<INotificationDocument, INotificationModel>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      default: NotificationType.GENERAL,
    },
    readStatus: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      trim: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ recipient: 1, readStatus: 1, createdAt: -1 });

export const Notification = model<INotificationDocument, INotificationModel>(
  'Notification',
  notificationSchema
);
