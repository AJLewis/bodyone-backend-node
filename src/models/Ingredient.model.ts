import mongoose, { Schema } from "mongoose";

export interface IIngredient {
  name: string;
  calories: number;
  caloriesPerUnit: number;
  serving_size_g: number;
  fat_total_g: number;
  fat_saturated_g: number;
  protein_g: number;
  sodium_mg: number;
  potassium_mg: number;
  cholesterol_mg: number;
  carbohydrates_total_g: number;
  fiber_g: number;
  sugar_g: number;
}


// todo: Make this required
const ingredientSchema = new Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: false },
  caloriesPerUnit: { type: Number, required: false },
  serving_size_g: { type: Number, required: false },
  fat_total_g: { type: Number, required: false },
  fat_saturated_g: { type: Number, required: false },
  protein_g: { type: Number, required: false },
  sodium_mg: { type: Number, required: false },
  potassium_mg: { type: Number, required: false },
  cholesterol_mg: { type: Number, required: false },
  carbohydrates_total_g: { type: Number, required: false },
  fiber_g: { type: Number, required: false },
  sugar_g: { type: Number, required: false },
});

const Ingredient = mongoose.model<IIngredient>('Ingredient', ingredientSchema);

export default Ingredient;