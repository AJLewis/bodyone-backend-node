import {Request, Response, NextFunction} from 'express';
import axios from 'axios';
import UserMealPlanModel from '../../models/UserMealPlan.model';
import MealPlanModel from '../../models/MealPlan.model';
import MealModel from '../../models/Meal.model';
import RecipeModel from '../../models/Recipe.model';
import UserModel from '../../models/User.model';
import IngredientModel from '../../models/Ingredient.model';

export const generateMealPlan = async (
    req: Request,
    res: Response,
    next?: NextFunction
) => {
    try {
        const prompt = req.body.prompt;
        const userId = req.body.userId;

        // 1) Send the prompt to the chat API and get the response
        const aiRequest = {
            messages: [
                {role: 'system', content: 'You are a helpful assistant.'},
                {role: 'user', content: prompt},
            ],
        };
        const aiResponse = await axios.post(
            'http://localhost:5001/api/private/openai/chat',
            aiRequest,
            {
                headers: {
                    Authorization: `Bearer ${process.env.SHARED_SECRET}`,
                },
            }
        );

        if (!aiResponse.data || !aiResponse.data.response) {
            return res
                .status(500)
                .json({error: 'Failed to get chat response.'});
        }

        const mealPlanData =
            aiResponse.data.response.choices[0].message.content;
        const json = JSON.parse(mealPlanData);

        const userMealPlans = [];

        for (const dayPlan of json.mealPlans) {
            const recipePromises = [];
            const recipeIds = [];

            for (const mealType of ['breakfast', 'lunch', 'dinner', 'snack']) {
                const recipeName = dayPlan[mealType];
                let recipe = await RecipeModel.findOne({name: recipeName});

                if (!recipe) {
                    recipePromises.push(createAiRecipe(recipeName));
                } else {
                    recipeIds.push({name: recipe.name, id: recipe._id});
                }
            }

            const createdRecipes = await Promise.all(recipePromises);

            for (const recipe of createdRecipes) {
                recipeIds.push({name: recipe?.name, id: recipe?._id});
            }

            const mealPromises = recipeIds.map((recipeId) => {
                const meal = new MealModel({
                    recipes: [recipeId.id],
                    name: recipeId.name,
                });
                return meal.save();
            });

            const meals = await Promise.all(mealPromises);

            const mealPlan = new MealPlanModel({
                meals: meals.map((meal) => meal._id),
            });
            await mealPlan.save();

            const userMealPlan = new UserMealPlanModel({
                user: userId,
                mealPlan: mealPlan._id,
            });
            await userMealPlan.save();
            userMealPlans.push(userMealPlan);
            const user = await UserModel.findById(userId);
            if (user) {
                user.mealPlans.push(userMealPlan._id);
                await user.save();
            }
        }

        res.status(201).json({
            message: 'Meal plan generated successfully',
            userMealPlans,
        });
    } catch (error: any) {
        console.error(error); // optional, logs the error on your server
        res.status(500).json({error: error.response.message});
    }
};

async function createAiRecipe(recipeName: string, index = 0) {
    const prompt = `Create a recipe called "${recipeName}" that is in this format: {"name": "Healthy Chicken Salad", "ingredients": [{ "ingredient": { "name": "chicken breast", "calories": 166.2, "carbohydrates_total_g": 0, "cholesterol_mg": 85, "fat_saturated_g": 1, "fat_total_g": 3.5, "fiber_g": 0, "potassium_mg": 226, "protein_g": 31, "serving_size_g": 100, "sodium_mg": 72, "sugar_g": 0 }, "quantity": 200 }, { "ingredient": { "name": "tomato", "calories": 18.2, "carbohydrates_total_g": 3.9, "cholesterol_mg": 0, "fat_saturated_g": 0, "fat_total_g": 0.2, "fiber_g": 1.2, "potassium_mg": 23, "protein_g": 0.9, "serving_size_g": 100, "sodium_mg": 4, "sugar_g": 2.6 }, "quantity": 100 }, { "ingredient": { "name": "lettuce", "calories": 17, "carbohydrates_total_g": 3.3, "cholesterol_mg": 0, "fat_saturated_g": 0, "fat_total_g": 0.3, "fiber_g": 2.1, "potassium_mg": 30, "protein_g": 1.2, "serving_size_g": 100, "sodium_mg": 7, "sugar_g": 1.2 }, "quantity": 100 }, { "ingredient": { "name": "cherry tomatoes", "calories": 17.8, "carbohydrates_total_g": 3.9, "cholesterol_mg": 0, "fat_saturated_g": 0, "fat_total_g": 0.2, "fiber_g": 1.2, "potassium_mg": 23, "protein_g": 0.9, "serving_size_g": 100, "sodium_mg": 5, "sugar_g": 2.6 }, "quantity": 50 }, { "ingredient": { "name": "cucumber", "calories": 15.3, "carbohydrates_total_g": 3.7, "cholesterol_mg": 0, "fat_saturated_g": 0, "fat_total_g": 0.1, "fiber_g": 0.5, "potassium_mg": 24, "protein_g": 0.6, "serving_size_g": 100, "sodium_mg": 1, "sugar_g": 1.7 }, "quantity": 50 }, { "ingredient": { "name": "olive oil", "__v": 0, "calories": 869.2, "carbohydrates_total_g": 0, "cholesterol_mg": 0, "fat_saturated_g": 13.9, "fat_total_g": 101.2, "fiber_g": 0, "potassium_mg": 0, "protein_g": 0, "serving_size_g": 100, "sodium_mg": 1, "sugar_g": 0 }, "quantity": 20 }, { "ingredient": { "name": "balsamic", "calories": 89.1, "carbohydrates_total_g": 17.3, "cholesterol_mg": 0, "fat_saturated_g": 0, "fat_total_g": 0, "fiber_g": 0, "potassium_mg": 19, "protein_g": 0.5, "serving_size_g": 100, "sodium_mg": 22, "sugar_g": 14.9 }, "quantity": 20 }], "instructions": "Grill the chicken breast and let it cool. Chop all the vegetables and combine them in a large bowl. Slice the cooled chicken and add it to the bowl. Drizzle with olive oil and balsamic, then toss well and serve.", "preparationTime": 20, "cookingTime": 10, "servings": 4, "cuisine": "International", "course": "Main Course", "diet": "High Protein"}`;
    const aiRecipeRequest = {
        messages: [
            {role: 'system', content: 'You are a helpful assistant.'},
            {role: 'user', content: prompt},
        ],
    };

    try {
        const aiRecipeResponse = await axios.post(
            'http://localhost:5001/api/private/openai/chat',
            aiRecipeRequest,
            {
                headers: {
                    Authorization: `Bearer ${process.env.SHARED_SECRET}`,
                },
            }
        );
        var json = JSON.parse(aiRecipeResponse.data.response.choices[0].message.content);

    } catch (e) {
        if ((index = 3)) {
            createAiRecipe(recipeName, index++);
        }
    }

    if (json) {
        const ingredientIds: any[] = [];

        // Iterate through the ingredients of the recipe
        for (const ingredient of json.ingredients) {
            // Check if the ingredient exists in the database
            let existingIngredient = await IngredientModel.findOne({
                name: ingredient.ingredient.name,
            });

            // If the ingredient doesn't exist, create a new one
            if (!existingIngredient) {
                const newIngredient = new IngredientModel(
                    ingredient.ingredient
                );
                await newIngredient.save();
                existingIngredient = newIngredient;
            }

            // Push the ingredient's id to the array
            ingredientIds.push({
                ingredient: existingIngredient._id,
                quantity: ingredient.quantity,
            });
        }

        json.ingredients = ingredientIds;

        const recipe = new RecipeModel(json);
        await recipe.save();
        return recipe;
    }
}
