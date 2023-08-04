import mongoose, { Document, Schema } from 'mongoose';
import { IUserDocument } from './User.model';

export interface IMessage {
  sender: IUserDocument;
  message: string;
  timestamp: Date;
}

export interface IUserChatDocument extends Document {
  participants: IUserDocument[];
  messages: IMessage[];
}

const messageSchema = new Schema<IMessage>({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const userChatSchema = new Schema<IUserChatDocument>({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  messages: [messageSchema],
});

const UserChat = mongoose.model<IUserChatDocument>('UserChat', userChatSchema);

export default UserChat;