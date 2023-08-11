import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { IIngredient } from "./Ingredient.model";

export interface IRecipeIngredient {
  ingredient: IIngredient;
  quantity: number;
}

export interface IRecipe extends Document {
  name: string;
  description?: string;
  mealType?: string;
  difficulty: string;
  cookingTips: string;
  servingSuggestions: string;
  leftoverStorage: string;
  ingredients: IRecipeIngredient[];
  tags: string[];
  instructions?: string[];
  preparationTime: number;
  cookingTime: number;
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
  mealType: { type: String, required: true },
  difficulty: { type: String, required: false },
  cookingTips: { type: String, required: false },
  servingSuggestions: { type: String, required: false },
  leftoverStorage: { type: String, required: false },
  ingredients: [recipeIngredientSchema],
  instructions: { type: [String], required: true },
  tags: { type: [String], required: false },
  preparationTime: { type: Number, required: false }, // in minutes
  cookingTime: { type: Number, required: false }, // in minutes
  cuisine: { type: String, required: false },
  dietaryRequirements: { type: [String], default: [] },
  course: { type: String, required: false }, // e.g., "main course", "dessert", etc.
  diet: { type: String, required: false }, 
  image: { type: Schema.Types.ObjectId, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const Recipe = mongoose.model<IRecipe>('Recipe', recipeSchema);

export default Recipe;