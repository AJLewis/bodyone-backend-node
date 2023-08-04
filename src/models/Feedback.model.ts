import mongoose, { Document, Schema } from 'mongoose';

export interface IFeedbackDocument extends Document {
  user: mongoose.Schema.Types.ObjectId; // Reference to the user who gave the feedback
  rating: number; // User's rating of the app
  comments: string; // User's comments
  date: Date; // Date when the feedback was given
}

const feedbackSchema = new Schema<IFeedbackDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true },
  comments: { type: String, required: false },
  date: { type: Date, default: Date.now },
});

const Feedback = mongoose.model<IFeedbackDocument>('Feedback', feedbackSchema);

export default Feedback;