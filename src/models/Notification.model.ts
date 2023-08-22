import mongoose, { Document, Schema } from 'mongoose';
import { IUserDocument } from './User.model';

export interface IAction {
  type: string;
  payload: any;
}

export interface INotificationDocument extends Document {
  user: IUserDocument;
  content: string;
  date: Date;
  viewed: boolean;
  action?: IAction;
}

const ActionSchema = new Schema<IAction>({
  type: { type: String, required: true },
  payload: { type: Schema.Types.Mixed, required: true },
});

const NotificationSchema = new Schema<INotificationDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true },
  viewed: { type: Boolean, default: false },
  action: ActionSchema,
});

const NotificationModel = mongoose.model<INotificationDocument>('Notification', NotificationSchema);

export default NotificationModel;