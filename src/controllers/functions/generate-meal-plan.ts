import {Request, Response, NextFunction} from 'express';
import axios from 'axios';
import UserMealPlanModel from '../../models/UserMealPlan.model';
import MealPlanModel from '../../models/MealPlan.model';
import MealModel from '../../models/Meal.model';
import RecipeModel from '../../models/Recipe.model';
import UserModel from '../../models/User.model';
import IngredientModel, {IIngredient} from '../../models/Ingredient.model';
import {IGenerateMealPlanConfig} from '../../interfaces/IGenerateMealPlanConfig';
import User from '../../models/User.model';
import {createMealPlanPrompt} from '../../prompts/create-meal-plan-prompt';
import {findParsableObject} from '../../utils/findParsalableObject';
import {IProductImage, ProductImageModel} from '../../models/ProductImage.model';
import { Schema } from 'mongoose';

// TODO: Ensure all food ingredient weights are calculated in grams.
// TODO: Ensure all serving sizes are for one portion
// TODO: Force 'course' property to be 'Appetizer, Starter, Main Course, Dessert, Side Dish'
// TODO: Add 'mealType' property to recipe to determine if it's breakfast, dinner, etc

let imageGenerationCounter = 0;

//TODO: fully implement or remove
export const generateSingleMealPlan = async (
    req: Request,
    res: Response,
    next?: NextFunction
) => {
    try {
        const result = await createSingleMealPlan(
            req.body.prompt,
            req.body.userId,
            req.body.date
        );
        res.status(201).json(result);
    } catch (error: any) {
        console.error(error); // optional, logs the error on your server
        res.status(500).json({error: error});
    }
};

// Multiple meal plans endpoint
export const generateMultipleMealPlans = async (
    req: Request,
    res: Response,
    next?: NextFunction
) => {
    try {
        const {config, userId} = req.body;

        if (!config || !userId) {
            return res.status(400).json({error: 'Missing required parameters'});
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        const mealPlanData = await generateAiResponse(user, config);

        if (!mealPlanData) {
            throw new Error('Failed to get parsable meal plan data.');
        }

        const userMealPlansPromises = [];

        const json = JSON.parse(mealPlanData);

        for (const plan of json.mealPlans) {
            const date =
                typeof plan.date === 'string'
                    ? plan.date
                    : plan.date.toISOString();
            const userMealPlan = createSingleMealPlan(
                userId,
                new Date(date),
                plan.meals
            );
            await new Promise((resolve) => setTimeout(resolve, 8000));
            userMealPlansPromises.push(userMealPlan);
        }

        const userMealPlans = await Promise.all(userMealPlansPromises);

        res.status(201).json({
            message: 'Meal plans generated successfully',
            userMealPlans,
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({error: error.message});
    }
};

const generateAiResponse = async (
    user: any,
    config: IGenerateMealPlanConfig
) => {
    const responseFormat = createMealPlanPrompt(user, config);
    const aiRequest = {
        messages: [
            {role: 'system', content: 'You are a helpful assistant.'},
            {
                role: 'user',
                content: `create a delicious meal ideas for each meal in the meal plan. I will then use this json object to create some recipes later. Be creative. Each title must not exceed 8 words, return it in the same format as this ${responseFormat}. The information has been provided. Be creative. Each title must be roughly 8 words`,
            },
        ],
        temperature: 1.2,
    };
    const aiResponse = await axios.post(
        `${process.env.API_BASE_HREF}${process.env.API_PRIVATE_LINK}/openai/chat`,
        aiRequest,
        {
            headers: {
                Authorization: `Bearer ${process.env.SHARED_SECRET}`,
            },
        }
    );

    if (!aiResponse.data || !aiResponse.data.response) {
        throw new Error('Failed to get chat response.');
    }

    return findParsableObject(
        aiResponse.data.response.choices[0].message.content
    );
};

const createSingleMealPlan = async (
    userId: string,
    date: Date,
    mealPlans: any, // Consider defining a proper type for mealPlans
    index: number = 0
): Promise<{message: string; userMealPlan?: any}> => {
    try {
        const recipePromises: Promise<any>[] = [];
        const recipeIds: any[] = [];

        for (const mealType of mealPlans) {
            const recipeName = Object.values(mealType)[0] as string;
            let recipe = await RecipeModel.findOne({name: recipeName});

            if (!recipe) {
                recipePromises.push(createAiRecipe(recipeName, userId));
            } else {
                recipeIds.push({
                    name: recipe.name,
                    id: recipe._id,
                    image: recipe.image,
                });
            }
        }

        const createdRecipes = await Promise.all(recipePromises);

        for (const recipe of createdRecipes) {
            if (recipe) {
                recipeIds.push({
                    name: recipe.name,
                    id: recipe._id,
                    image: recipe.image,
                });
            } else {
                throw new Error('Failed to create recipe');
            }
        }

        const mealPromises = recipeIds.map((recipeId) => {
            const meal = new MealModel({
                recipes: [recipeId.id],
                name: recipeId.name,
                images: recipeId.image ? [recipeId.image] : [],
            });
            return meal.save();
        });

        const meals = await Promise.all(mealPromises);

        const mealPlan = new MealPlanModel({
            meals: meals.map((meal) => meal?._id),
            date: date,
        });

        await mealPlan.save();

        const userMealPlan = new UserMealPlanModel({
            user: userId,
            mealPlan: mealPlan._id,
        });
        await userMealPlan.save();

        const user = await UserModel.findById(userId);

        if (user) {
            user.mealPlans.push(userMealPlan._id);
            await user.save();
        } else {
            throw new Error('User not found');
        }

        return {
            message: 'Meal plan generated successfully',
            userMealPlan,
        };
    } catch (error: any) {
        console.error(error);
        throw new Error(`Failed to create meal plan: ${error.message}`);
    }
};

const createAiRecipe = async (recipeName: string, userId: string, index = 0): Promise<any> => {
    if (index >= 50) {
        throw new Error('Maximum retry attempts reached');
    }

    const prompt = `Create a recipe called "${recipeName}" that is in this format: {"name": "Healthy Chicken Salad", "description": "Healthy Chicken Salad is a nutritious and flavorful dish that typically consists of cooked and diced chicken breast, mixed with various fresh vegetables like lettuce, tomatoes, cucumbers, and sometimes fruits like grapes or apples. The salad is often dressed with a light vinaigrette or yogurt-based dressing to keep it on the healthier side, avoiding heavy mayonnaise or cream-based dressings. Additional ingredients like nuts, seeds, or herbs might be added for extra texture and flavor. This salad is known for being high in protein and low in unhealthy fats, making it a popular choice for those on a health-conscious diet. It can be served as a main course or a side dish and is often enjoyed as a refreshing meal option, especially during the warmer months." "ingredients": [{ "ingredient": { "name": "chicken breast", "calories": 166.2, "carbohydrates_total_g": 0, "cholesterol_mg": 85, "fat_saturated_g": 1, "fat_total_g": 3.5, "fiber_g": 0, "potassium_mg": 226, "protein_g": 31, "serving_size_g": 100, "sodium_mg": 72, "sugar_g": 0 }, "quantity": 200 }, { "ingredient": { "name": "tomato", "calories": 18.2, "carbohydrates_total_g": 3.9, "cholesterol_mg": 0, "fat_saturated_g": 0, "fat_total_g": 0.2, "fiber_g": 1.2, "potassium_mg": 23, "protein_g": 0.9, "serving_size_g": 100, "sodium_mg": 4, "sugar_g": 2.6 }, "quantity": 100 }, { "ingredient": { "name": "lettuce", "calories": 17, "carbohydrates_total_g": 3.3, "cholesterol_mg": 0, "fat_saturated_g": 0, "fat_total_g": 0.3, "fiber_g": 2.1, "potassium_mg": 30, "protein_g": 1.2, "serving_size_g": 100, "sodium_mg": 7, "sugar_g": 1.2 }, "quantity": 100 }, { "ingredient": { "name": "cherry tomatoes", "calories": 17.8, "carbohydrates_total_g": 3.9, "cholesterol_mg": 0, "fat_saturated_g": 0, "fat_total_g": 0.2, "fiber_g": 1.2, "potassium_mg": 23, "protein_g": 0.9, "serving_size_g": 100, "sodium_mg": 5, "sugar_g": 2.6 }, "quantity": 50 }, { "ingredient": { "name": "cucumber", "calories": 15.3, "carbohydrates_total_g": 3.7, "cholesterol_mg": 0, "fat_saturated_g": 0, "fat_total_g": 0.1, "fiber_g": 0.5, "potassium_mg": 24, "protein_g": 0.6, "serving_size_g": 100, "sodium_mg": 1, "sugar_g": 1.7 }, "quantity": 50 }, { "ingredient": { "name": "olive oil", "__v": 0, "calories": 869.2, "carbohydrates_total_g": 0, "cholesterol_mg": 0, "fat_saturated_g": 13.9, "fat_total_g": 101.2, "fiber_g": 0, "potassium_mg": 0, "protein_g": 0, "serving_size_g": 100, "sodium_mg": 1, "sugar_g": 0 }, "quantity": 20 }, { "ingredient": { "name": "balsamic", "calories": 89.1, "carbohydrates_total_g": 17.3, "cholesterol_mg": 0, "fat_saturated_g": 0, "fat_total_g": 0, "fiber_g": 0, "potassium_mg": 19, "protein_g": 0.5, "serving_size_g": 100, "sodium_mg": 22, "sugar_g": 14.9 }, "quantity": 20 }], "instructions": ["Grill the chicken breast and let it cool", "Chop all the vegetables and combine them in a large bowl", "Chop all the vegetables and combine them in a large bowl", "Slice the cooled chicken and add it to the bowl", " Drizzle with olive oil and balsamic, then toss well and serve]", "preparationTime": 20, "cookingTime": 10, "servings": 4, "cuisine": "International", "course": "Main Course", "diet": "High Protein"}`;

    // model: "gpt-4",
    // maxTokens: 7000,

    const aiRecipeRequest = {
        messages: [
            {role: 'system', content: 'You are a helpful assistant.'},
            {role: 'user', content: prompt},
        ],
    };

    try {
        const aiRecipeResponse = await axios.post(
            `${process.env.API_BASE_HREF}${process.env.API_PRIVATE_LINK}/openai/chat`,
            aiRecipeRequest,
            {
                headers: {
                    Authorization: `Bearer ${process.env.SHARED_SECRET}`,
                },
            }
        );

        var json;

        try {
            json = JSON.parse(
                aiRecipeResponse.data.response.choices[0].message.content
            );
        } catch (err: any) {
            return createAiRecipe(recipeName, userId, index + 1);
        }
    } catch (e) {
        console.error(e);
        return createAiRecipe(recipeName, userId, index + 1);
    }

    const user = await User.findById(userId);
    json.dietaryRequirements = user?.dietaryRequirements;
    // Process image and ingredients
    const image = await processImage(json, recipeName);
    json.image = image._id;
    console.log(json.image);
    const ingredients = await processIngredients(json);
    json.ingredients = ingredients;
    json.user = userId;
    const recipe = new RecipeModel(json);
    await recipe.save();
    return recipe;
};

const processImage = async (json: any, recipeName: string) => {
    try {
        const ingredientNames: string[] = json.ingredients.map(
            (ingredient: any) => {
                return ingredient.ingredient.name;
            }
        );

        const request = {
            prompt: `create a beautiful header image for ${recipeName} after it's cooked with the following ingredients: ${ingredientNames.join( ', ' )} on tableware. hyperrealistic, highly detailed, cinematic lighting, stunningly beautiful, intricate, sharp focus, f/1. 8, 85mm, (centered image composition), (professionally color graded), ((bright soft diffused light)), volumetric fog, trending on instagram, trending on tumblr, HDR 8K`,
        };

        const response: any = await axios.post(
            `${process.env.API_BASE_HREF}${process.env.API_PRIVATE_LINK}/stablediffusion/text_to_image`,
            request,
            {
                headers: {
                    Authorization: `Bearer ${process.env.SHARED_SECRET}`,
                },
            }
        );

        if (response && response.data.status === 'processing') {
            const productImageDoc = new ProductImageModel({
                uri: response?.data.id.toString(),
                name: recipeName,
                isPending: true,
            });
            productImageDoc.save();
            return productImageDoc._id;
        } else if (response && response.data.output) {
            const productImageDoc = new ProductImageModel({
                uri: response?.data.output[0],
                name: recipeName,
            });

            productImageDoc.save();
            return productImageDoc._id;
        } else {
            processImage(json, recipeName);
        }
    } catch (error) {
        console.error(error);
    }
};

const processIngredients = async (json: any) => {
    const ingredientIds: any[] = [];

    for (const aiIngredient of json.ingredients) {
        let ingredient = aiIngredient.ingredient;

        try {
            const request = {
                query: ingredient.name,
            };

            const response = await axios.post(
                `${process.env.API_BASE_HREF}${process.env.API_PRIVATE_LINK}/rapid/nutrition`,
                request,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.SHARED_SECRET}`,
                    },
                }
            );

            if (response.data[0]) {
                ingredient = response.data[0];
                ingredient.caloriesPerUnit =
                    ingredient.calories / ingredient.serving_size_g;
            }
        } catch (error) {
            console.error(error);
        }

        // Check if the ingredient exists in the database
        let existingIngredient = await IngredientModel.findOne({
            name: ingredient.name,
        });

        // If the ingredient doesn't exist, create a new one
        if (!existingIngredient) {
            const newIngredient = new IngredientModel(ingredient);
            await newIngredient.save();
            existingIngredient = newIngredient;
        }

        // Push the ingredient's id to the array
        ingredientIds.push({
            ingredient: existingIngredient._id,
            quantity: ingredient.quantity,
        });
    }

    return ingredientIds;
};
