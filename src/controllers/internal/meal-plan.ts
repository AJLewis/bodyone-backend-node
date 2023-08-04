import { NextFunction, Request, Response } from "express";
import MealPlanModel from "../../models/MealPlan.model";

export const createMealPlan = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const mealPlanData = req.body;
    const mealPlan = new MealPlanModel(mealPlanData);
    await mealPlan.save();

    res.status(201).json({
      message: 'MealPlan created successfully',
      mealPlan,
    });
  } catch (error) {
    console.error(error); // optional, logs the error on your server
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
};

export const getMealPlan = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const mealPlan = await MealPlanModel.findById(req.params.id).populate('meals');
    if (!mealPlan) {
      return res.status(404).send();
    }
    res.send(mealPlan);
  } catch (e) {
    console.error(e); // optional, logs the error on your server
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const getAllMealPlans = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const mealPlans = await MealPlanModel.find({}).populate('meals');
    res.send(mealPlans);
  } catch (e) {
    console.error(e); // optional, logs the error on your server
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};


export const updateMealPlan = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['startDate', 'endDate', 'meals'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' });
    }

    const mealPlan = await MealPlanModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!mealPlan) {
      return res.status(404).send();
    }

    res.send(mealPlan);
  } catch (e) {
    console.error(e); // optional, logs the error on your server
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const deleteMealPlan = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const mealPlan = await MealPlanModel.findByIdAndDelete(req.params.id);
    if (!mealPlan) {
      return res.status(404).send();
    }
    res.send(mealPlan);
  } catch (e) {
    console.error(e); // optional, logs the error on your server
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};