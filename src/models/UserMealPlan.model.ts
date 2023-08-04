import mongoose, { Document, Schema } from 'mongoose';
import { IUserDocument } from './User.model';
import { IMealPlan } from './MealPlan.model';

export interface IUserMealPlanDocument extends Document {
  user: IUserDocument;
  mealPlan: IMealPlan;
  date: Date;
}

const UserMealPlanSchema = new Schema<IUserMealPlanDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  mealPlan: { type: Schema.Types.ObjectId, ref: 'MealPlan', required: true },
  date: { type: Date, required: true, default: Date.now },
});

const UserMealPlanModel = mongoose.model<IUserMealPlanDocument>('UserMealPlan', UserMealPlanSchema);

export default UserMealPlanModel