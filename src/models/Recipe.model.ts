import mongoose, { Schema, Document } from "mongoose";
import { IIngredient } from "./Ingredient.model";

interface IRecipeIngredient {
  ingredient: IIngredient;
  quantity: number;
}

export interface IRecipe extends Document {
  name: string;
  ingredients: IRecipeIngredient[];
  instructions: string;
  preparationTime: number;
  cookingTime: number;
  servings: number;
  cuisine: string;
  course: string;
  diet: string;
  image: string;
}

const recipeIngredientSchema = new Schema({
  ingredient: { type: Schema.Types.ObjectId, ref: 'Ingredient', required: true },
  quantity: {  type:  mongoose.Schema.Types.Mixed, required: false },
});

const recipeSchema = new Schema({
  name: { type: String, required: true },
  ingredients: [recipeIngredientSchema],
  instructions: { type: String, required: true },
  preparationTime: { type: Number, required: true }, // in minutes
  cookingTime: { type: Number, required: false }, // in minutes
  servings: { type: Number, required: true },
  cuisine: { type: String, required: false },
  course: { type: String, required: false }, // e.g., "main course", "dessert", etc.
  diet: { type: String, required: false }, // e.g., "vegan", "gluten-free", etc.
  image: { type: String, required: false },
});

const Recipe = mongoose.model<IRecipe>('Recipe', recipeSchema);

export default Recipe;