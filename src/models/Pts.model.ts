import mongoose, { Document, ObjectId, Schema } from 'mongoose';

export interface IPointsDocument extends Document {
  user: ObjectId; // Reference to the user who owns the points
  points: number; // Current number of points
  history: { // History of points transactions
    date: Date;
    change: number; // Positive for points earned, negative for points spent
    reason: string; // Reason for the change in points
  }[];
}

const PointsSchema = new Schema<IPointsDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  points: { type: Number, default: 0 },
  history: [{
    date: { type: Date, default: Date.now },
    change: { type: Number, required: true },
    reason: { type: String, required: true },
  }],
});

const PointsModel = mongoose.model<IPointsDocument>('Points', PointsSchema);

export default PointsModel;