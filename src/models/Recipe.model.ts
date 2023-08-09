import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { IIngredient } from "./Ingredient.model";

interface IRecipeIngredient {
  ingredient: IIngredient;
  quantity: number;
}

export interface IRecipe extends Document {
  name: string;
  description?: string;
  ingredients: IRecipeIngredient[];
  instructions?: string[];
  preparationTime: number;
  cookingTime: number;
  servings: number;
  cuisine: string;
  dietaryRequirements: string[];
  course: string;
  diet: string;
  image: mongoose.Schema.Types.ObjectId;
  user: ObjectId;
}

const recipeIngredientSchema = new Schema({
  ingredient: { type: Schema.Types.ObjectId, ref: 'Ingredient', required: true },
  quantity: {  type:  mongoose.Schema.Types.Mixed, required: false },
});

const recipeSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  ingredients: [recipeIngredientSchema],
  instructions: { type: [String], required: true },
  preparationTime: { type: Number, required: true }, // in minutes
  cookingTime: { type: Number, required: false }, // in minutes
  servings: { type: Number, required: true },
  cuisine: { type: String, required: false },
  dietaryRequirements: { type: [String], default: [] },
  course: { type: String, required: false }, // e.g., "main course", "dessert", etc.
  diet: { type: String, required: false }, 
  image: { type: Schema.Types.ObjectId, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const Recipe = mongoose.model<IRecipe>('Recipe', recipeSchema);

export default Recipe;