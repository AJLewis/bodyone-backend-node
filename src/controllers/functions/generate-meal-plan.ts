import {Request, Response, NextFunction} from 'express';
import axios from 'axios';
import UserMealPlanModel from '../../models/UserMealPlan.model';
import MealPlanModel from '../../models/MealPlan.model';
import MealModel from '../../models/Meal.model';
import UserModel from '../../models/User.model';
import IngredientModel, {IIngredient} from '../../models/Ingredient.model';
import {IGenerateMealPlanConfig} from '../../interfaces/IGenerateMealPlanConfig';
import User from '../../models/User.model';
import {createMealPlanPrompt} from '../../prompts/create-meal-plan-prompt';
import {findParsableObject} from '../../utils/findParsalableObject';
import {ProductImageModel} from '../../models/ProductImage.model';
import RecipeModel, {IRecipe} from '../../models/Recipe.model';
import {generateRecipeImage} from './generate-recipe-image';
import {validateAndCorrectRecipe} from '../../utils/validateAndCorrectRecipe';
const recipeDemo = require('../../../_SCRAP/examples-json/recipe.json');

// TODO: Force 'course' property to be 'Appetizer, Starter, Main Course, Dessert, Side Dish'
// TODO: Add 'mealType' property to recipe to determine if it's breakfast, dinner, etc

//TODO: fully implement or remove

let aiRegenerationAttempts = 0;

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
        console.log('generating multiple meal plans');

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

        try {
            var json = JSON.parse(mealPlanData);
        } catch (err) {
            generateMultipleMealPlans(req, res, next);
        }

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

        console.log('user meal plan promises resolved');
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
    const recipePromises: Promise<any>[] = [];
    const recipeIds: any[] = [];
    console.log('creating single meal plan');
    try {
        for (const mealType of mealPlans) {
            const meal = Object.entries(mealType)[0];
            const recipeName = meal[1] as string;
            const type = meal[0] as string;
            let recipe = await RecipeModel.findOne({name: recipeName});

            if (!recipe) {
                recipePromises.push(createAiRecipe(recipeName, type, userId));
            } else {
                recipeIds.push({
                    name: recipe.name,
                    id: recipe.id,
                    image: recipe.image,
                });
            }
        }
    } catch (error: any) {
        console.error(error);
        throw new Error(`Failed to create meal plan: ${error.message}`);
    }

    const createdRecipes = await Promise.all(recipePromises);

    for (const recipe of createdRecipes) {
        if(recipe !== null) {
            try {
                recipeIds.push({
                    name: recipe.name,
                    id: recipe._id,
                    image: recipe.image,
                });
            } catch(err: any) {
                console.log(err)
            }
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

    console.log('meal promises resolved');

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
};

const createAiRecipe = async (
    recipeName: string,
    type: string,
    userId: string,
    index = 0
): Promise<any> => {
    if (index >= 5) {
        throw new Error('Maximum retry attempts reached');
    }

    const prompt = `Create a recipe called "${recipeName}"`;

    // model: "gpt-4",
    // maxTokens: 7000,

    const aiRecipeRequest = {
        messages: [
            {role: 'system', content: `You are a chef who creates custom recipes. You will always return the response as a json object in exactly in this format: ${JSON.stringify(
                recipeDemo
            )}. The response must be parsable.`},
            {role: 'user', content: prompt},
        ],
    };

    var json: IRecipe | null= null;

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

        let replaceAll;

        try {
            const parsableObject = findParsableObject(aiRecipeResponse.data.response.choices[0].message.content) as string;
            replaceAll = parsableObject.replaceAll('\n', '');
            json = validateAndCorrectRecipe(JSON.parse(replaceAll));
        } catch (err: any) {
            console.error(err);
            console.log(replaceAll);
            if (aiRegenerationAttempts < 3)
                return createAiRecipe(recipeName, type, userId, index + 1);
        }
    } catch (e) {
        console.error(e);
        if (aiRegenerationAttempts < 3)
            return createAiRecipe(recipeName, type, userId, index + 1);
    }

    const user = await User.findById(userId);

    if (json) {
        json.mealType = type;
        json.dietaryRequirements = user?.dietaryRequirements
            ? user?.dietaryRequirements
            : [];

        const productImageDoc = new ProductImageModel({
            uri: 'holding',
            name: recipeName,
            isPending: true,
        });

        productImageDoc.save();
        json.image = productImageDoc.id;
        json.user = user?.id;
        const ingredientsList = json.ingredients;

        let recipe;

        try {
            json = await processIngredients(json);
            recipe = new RecipeModel(json);
            await recipe.save();

            console.log('recipe saved');

        } catch (err) {
            console.log(err);
            if (aiRegenerationAttempts < 3) {
                console.log(`attempt ${aiRegenerationAttempts}. retying recipe generation`);
                aiRegenerationAttempts++;
                return createAiRecipe(recipeName, type, userId, index + 1);
            }
        } 

        generateRecipeImage(
            'stable-diffusion',
            recipeName,
            productImageDoc,
            ingredientsList
        );

        console.log('recipe image generating');

        return recipe;

    } else {
        if (aiRegenerationAttempts < 3) {
            console.log(`attempt ${aiRegenerationAttempts}. retying recipe generation`);
            aiRegenerationAttempts++;
            return createAiRecipe(recipeName, type, userId, index + 1);
        } else {
            return null;
        }
    }
};

const processIngredients = async (recipe: IRecipe) => {
    const ingredientIds: any[] = [];

    for (const aiIngredient of recipe.ingredients) {
        let ingredient = aiIngredient.ingredient;

        // Check if the ingredient exists in the database
        let existingIngredient = await IngredientModel.findOne({
            name: ingredient.name,
        });

        if (!existingIngredient) {
            ingredient.caloriesPerUnit =
                parseInt(ingredient.calories.toString()) /
                parseInt(ingredient.serving_size_g.toString());
            const newIngredient = new IngredientModel(ingredient);
            await newIngredient.save();
            recipe.ingredients.push({
                ingredient: newIngredient,
                quantity: aiIngredient.quantity,
            });

            existingIngredient = newIngredient;
            ingredientIds.push({
                ingredient: existingIngredient._id,
                quantity: aiIngredient.quantity,
            });
        } else {
            existingIngredient.caloriesPerUnit = existingIngredient.caloriesPerUnit ?
                existingIngredient.caloriesPerUnit : 
                parseInt(ingredient.calories.toString()) /
                parseInt(ingredient.serving_size_g.toString());
            // Push the ingredient's id to the array
            ingredientIds.push({
                ingredient: existingIngredient._id,
                quantity: aiIngredient.quantity,
            });
        }
    }

    recipe.ingredients = ingredientIds;
    return recipe;
};
