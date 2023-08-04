import mongoose, { Document, Schema } from 'mongoose';
import { IUserDocument } from './User.model';

export interface IGroupDocument extends Document {
  name: string;
  description: string;
  createdDate: Date;
  members: IUserDocument[];
  // Add more fields as needed
}

const groupSchema = new Schema<IGroupDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  // Add more fields based on your requirements
});

const GroupModel = mongoose.model<IGroupDocument>('Group', groupSchema);

export default GroupModel;