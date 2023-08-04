import mongoose, { Document, Schema } from 'mongoose';
import { IUserDocument } from './User.model';
import { IMeal } from './Meal.model';

export interface IMealPlan extends Document {
  user: IUserDocument;
  meals: IMeal[];
}

const mealPlanSchema = new Schema({
    meals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }],
});

const MealPlan = mongoose.model<IMealPlan>('MealPlan', mealPlanSchema);

export default MealPlan;