import mongoose, { Document, Schema } from 'mongoose';
import { IUserDocument } from './User.model';

export interface IComment {
  user: IUserDocument;
  content: string;
  date: Date;
}

export interface ICommunityPostDocument extends Document {
  user: IUserDocument;
  content: string;
  date: Date;
  likes: IUserDocument[];
  comments: IComment[];
}

const commentSchema = new Schema<IComment>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const communityPostSchema = new Schema<ICommunityPostDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
});

const CommunityPost = mongoose.model<ICommunityPostDocument>('CommunityPost', communityPostSchema);

export default CommunityPost;