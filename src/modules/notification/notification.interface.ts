import type { Document, Model, Types } from 'mongoose';
import { NotificationType } from '../../constants';

export interface INotification {
  recipient: Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  readStatus: boolean;
  link?: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INotificationDocument extends INotification, Document {}
export type INotificationModel = Model<INotificationDocument>;
