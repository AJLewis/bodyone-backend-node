import express, { NextFunction, Request, Response } from 'express';
import MealModel from '../../models/Meal.model';

export const createMeal = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const mealData = req.body;
    const meal = new MealModel(mealData);
    await meal.save();

    res.status(201).json({
      message: 'Meal created successfully',
      meal,
    });
  } catch (error) {
    console.error(error); // optional, logs the error on your server
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
};

export const getAllMeals = async (req: Request, res: Response, next?: NextFunction) => {
  try {
      const meals = await MealModel.find({}).populate('recipes');
      res.send(meals);
  } catch (e) {
      console.error(e); // optional, logs the error on your server
      res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const getMeal = async (req: Request, res: Response, next?: NextFunction) => {
  try {
      const meal = await MealModel.findById(req.params.id).populate('recipes');
      if (!meal) {
          return res.status(404).send();
      }
      res.send(meal);
  } catch (e) {
      console.error(e); // optional, logs the error on your server
      res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const updateMeal = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const meal = await MealModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!meal) {
        return res.status(404).send();
    }
    res.send(meal);
  } catch (e) {
    console.error(e); // optional, logs the error on your server
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const deleteMeal = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const meal = await MealModel.findByIdAndDelete(req.params.id);
    if (!meal) {
        return res.status(404).send();
    }
    res.send(meal);
  } catch (e) {
    console.error(e); // optional, logs the error on your server
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};
