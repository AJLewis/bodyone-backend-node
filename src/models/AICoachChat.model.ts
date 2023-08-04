import mongoose, { Document, Schema } from 'mongoose';
import { IUserDocument } from './User.model';

export interface IAICoachChatDocument extends Document {
  user: IUserDocument;
  aiCoachName: string;
  messages: {
    from: 'User' | 'AICoach';
    body: string;
    createdAt: Date;
  }[];
}

const AICoachChatSchema = new Schema<IAICoachChatDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  aiCoachName: { type: String, required: true },
  messages: [{
    from: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    body: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }],
});

const AICoachChatModel = mongoose.model<IAICoachChatDocument>('AICoachChat', AICoachChatSchema);

export default AICoachChatModel;