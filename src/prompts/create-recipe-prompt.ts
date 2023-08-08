import {IRecipe} from '../models/Recipe.model';
import { IUserDocument } from '../models/User.model';

export const createRecipePrompt = (recipeName: string, mealType: string, user: IUserDocument, date: Date = new Date()): string => {
    const recipe = {
        name: 'RecipeNameHere',
        ingredients: [
            {
                ingredient: {
                    name: 'IngredientNameHere',
                    calories: 180,
                    serving_size_g: 50,
                    fat_total_g: 1,
                    fat_saturated_g: 0,
                    protein_g: 7,
                    sodium_mg: 0,
                    potassium_mg: 363,
                    cholesterol_mg: 0,
                    carbohydrates_total_g: 39,
                    fiber_g: 7,
                    sugar_g: 2,
                },
                quantity: 200,
            }
        ],
        instructions:
            'InstructionsHere',
        preparationTime: 10,
        cookingTime: 15,
        servings: 4,
        cuisine: 'Italian',
        course: 'Main Course',
        diet: 'High Fiber',
    };

    const prompt = `Create a recipe called ${recipeName} for ${mealType} on this date ${date}. Here are the user dietary details: ${user.dietaryRequirements}. Here are the users fitness goals: ${user.fitnessGoals}. Here are the users food preferences: ${user.foodPreferences}. Be creative when generating the recipe and return it in this format exactly: ${recipe}.`;
    return JSON.stringify(prompt);
};
