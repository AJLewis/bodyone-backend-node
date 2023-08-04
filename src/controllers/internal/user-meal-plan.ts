import express, { NextFunction, Request, Response } from 'express';
import UserMealPlanModel from '../../models/UserMealPlan.model';

export const createUserMealPlan = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const { user, mealPlan, date } = req.body;
    const userMealPlan = new UserMealPlanModel({ user, mealPlan, date });
    await userMealPlan.save();

    res.status(201).json({
      message: 'UserMealPlan created successfully',
      userMealPlan,
    });
  } catch (error) {
    console.error(error); // optional, logs the error on your server
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
};

export const getAllUserMealPlans = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const userMealPlans = await UserMealPlanModel.find({});
    res.send(userMealPlans);
  } catch (e) {
    console.error(e); // optional, logs the error on your server
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const getUserMealPlan = async (req: Request, res: Response, next?: NextFunction) => {
  try {
      const userMealPlan = await UserMealPlanModel.findById(req.params.id).populate('user').populate('mealPlan');
      if (!userMealPlan) {
          return res.status(404).send();
      }
      res.send(userMealPlan);
  } catch (e) {
      console.error(e); // optional, logs the error on your server
      res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const updateUserMealPlan = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['user', 'mealPlan', 'date'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates!' });
    }

    const userMealPlan = await UserMealPlanModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!userMealPlan) {
      return res.status(404).send();
    }

    res.send(userMealPlan);
  } catch (e) {
    console.error(e); // optional, logs the error on your server
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const deleteUserMealPlan = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const userMealPlan = await UserMealPlanModel.findByIdAndDelete(req.params.id);
    if (!userMealPlan) {
        return res.status(404).send();
    }
    res.send(userMealPlan);
  } catch (e) {
    console.error(e); // optional, logs the error on your server
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};