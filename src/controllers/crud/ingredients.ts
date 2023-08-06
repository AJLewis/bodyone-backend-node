import express, { NextFunction, Request, Response } from 'express';
import IngredientModel from '../../models/Ingredient.model';

export const createIngredient = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const ingredientData = req.body;
    const ingredient = new IngredientModel(ingredientData);
    await ingredient.save();

    res.status(201).json({
      message: 'Ingredient created successfully',
      ingredient,
    });
  } catch (error) {
    console.error(error); // optional, logs the error on your server
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
};

export const createIngredients = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const ingredientsData = req.body;
    const results = [];

    for (const ingredientData of ingredientsData) {
      // First, try to find an existing ingredient with the same name
      let ingredient = await IngredientModel.findOne({ name: ingredientData.name });

      // If the ingredient doesn't exist, create a new one
      if (!ingredient) {
        const result = await IngredientModel.updateOne(
          { name: ingredientData.name },
          { $setOnInsert: ingredientData },
          { upsert: true }
        );

        // If an upsert took place, fetch the new ingredient
        if (result.upsertedCount > 0 && result.upsertedId) {
          ingredient = await IngredientModel.findById(result.upsertedId._id);
        }
      }

      // Add the ingredient (either existing or new) to the results array
      if (ingredient) {
        results.push(ingredient._id);
      }
    }

    res.status(201).json({
      message: 'Ingredients processed successfully',
      ingredients: results,
    });
  } catch (error) {
    console.error(error); // optional, logs the error on your server
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
};

export const getAllIngredients = async (req: Request, res: Response, next?: NextFunction) => {
  try {
      const ingredients = await IngredientModel.find({});
      res.send(ingredients);
  } catch (e) {
      console.error(e); // optional, logs the error on your server
      res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const getIngredient = async (req: Request, res: Response, next?: NextFunction) => {
  try {
      const ingredient = await IngredientModel.findById(req.params.id);
      if (!ingredient) {
          return res.status(404).send();
      }
      res.send(ingredient);
  } catch (e) {
      console.error(e); // optional, logs the error on your server
      res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const deleteIngredient = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const ingredient = await IngredientModel.findByIdAndDelete(req.params.id);
    if (!ingredient) {
        return res.status(404).send();
    }
    res.send(ingredient);
  } catch (e) {
    console.error(e); // optional, logs the error on your server
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};