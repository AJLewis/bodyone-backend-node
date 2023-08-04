import mongoose, { Document, Schema } from 'mongoose';
import { IUserDocument } from './User.model';
import { IWorkoutPlanDocument } from './WorkoutPlan.model';

export interface IUserWorkoutPlanDocument extends Document {
  [key: string]: any; 
  user: IUserDocument;
  workoutPlan: IWorkoutPlanDocument;
  date: Date;
}

const UserWorkoutPlanSchema = new Schema<IUserWorkoutPlanDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  workoutPlan: { type: Schema.Types.ObjectId, ref: 'WorkoutPlan', required: true },
  date: { type: Date, required: true },
});

const UserWorkoutPlanModel = mongoose.model<IUserWorkoutPlanDocument>('UserWorkoutPlan', UserWorkoutPlanSchema);

export default UserWorkoutPlanModel