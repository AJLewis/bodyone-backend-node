import mongoose, { Schema, Document, Types } from "mongoose";
import { IRecipe } from "./Recipe.model";

export interface IMeal extends Document {
  name: string; // e.g., "Breakfast", "Lunch", "Dinner"
  recipes: IRecipe[];
  images: Types.ObjectId[]; // Array of image ObjectIds
}

const mealSchema = new Schema({
  name: { type: String, required: true },
  recipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
  images: [{ type: Schema.Types.ObjectId, ref: 'Image' }], // Array of image ObjectIds
});

const Meal = mongoose.model<IMeal>('Meal', mealSchema);

export default Meal;