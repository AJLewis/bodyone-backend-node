import mongoose, { Document, Schema } from 'mongoose';
import { IUserDocument } from './User.model';

export interface IMessageDocument extends Document {
  sender: IUserDocument;
  receiver: IUserDocument;
  previousMessage?: IMessageDocument
  subject: string;
  content: string;
  date: Date;
  viewed: boolean;
}

const MessageSchema = new Schema<IMessageDocument>({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  previousMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true },
  viewed: { type: Boolean, default: false },
});

const MessageModel = mongoose.model<IMessageDocument>('Message', MessageSchema);

export default MessageModel;