import express, { NextFunction, Request, Response } from 'express';
import RecipeModel from '../../models/Recipe.model';

export const createRecipe = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const recipeData = req.body;
    const recipe = new RecipeModel(recipeData);
    await recipe.save();

    res.status(201).json({
      message: 'Recipe created successfully',
      recipe,
    });
  } catch (error) {
    console.error(error); // optional, logs the error on your server
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
};

export const getAllRecipes = async (req: Request, res: Response, next?: NextFunction) => {
  try {
      const recipes = await RecipeModel.find({}).populate('ingredients.ingredient');
      console.log(`recipes length ${recipes.length}`)
      res.send(recipes);
  } catch (e) {
      console.error(e); // optional, logs the error on your server
      res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const getRecipe = async (req: Request, res: Response, next?: NextFunction) => {
  try {
      const recipe = await RecipeModel.findById(req.params.id).populate('ingredients.ingredient');
      if (!recipe) {
          return res.status(404).send();
      }
      res.send(recipe);
  } catch (e) {
      console.error(e); // optional, logs the error on your server
      res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const deleteRecipe = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const recipe = await RecipeModel.findByIdAndDelete(req.params.id);
    if (!recipe) {
        return res.status(404).send();
    }
    res.send(recipe);
  } catch (e) {
    console.error(e); // optional, logs the error on your server
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const updateRecipe = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'ingredients', 'instructions', 'preparationTime', 'cookingTime', 'servings', 'cuisine', 'course', 'diet', 'image'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' });
    }

    const recipe = await RecipeModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!recipe) {
      return res.status(404).send();
    }

    res.send(recipe);
  } catch (e) {
    console.error(e); // optional, logs the error on your server
    res.status(400).send(e);
  }
};