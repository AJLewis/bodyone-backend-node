import mongoose, { Schema } from "mongoose";
import { IRecipe } from "./Recipe.model";

export interface IMeal extends Document {
  name: string; // e.g., "Breakfast", "Lunch", "Dinner"
  recipes: IRecipe[];
}

const mealSchema = new Schema({
  name: { type: String, required: true },
  recipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
});

const Meal = mongoose.model<IMeal>('Meal', mealSchema);

export default Meal;