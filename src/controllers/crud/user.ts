import express, { NextFunction, Request, Response } from 'express';
import User from '../../models/User.model'; // Assuming this is the location of your User model

export const getAllUsers = async (req: Request, res: Response, next?: NextFunction) => {
  try {
      const users = await User.find({});
      res.send(users);
  } catch (e) {
      console.error(e); // optional, logs the error on your server
      res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const getUserBasic = async (req: Request, res: Response, next?: NextFunction) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (e) {
        console.error(e); // optional, logs the error on your server
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
  };

export const getUser = async (req: Request, res: Response, next?: NextFunction) => {
    try {
        const user = await User.findById(req.params.id).populate({
            path: 'workoutPlans',
            populate: {
              path: 'workoutPlan',
              model: 'WorkoutPlan',
              populate: {
                path: 'exercises.exercise',
                model: 'Exercise'
              }
            }
          }).populate({
            path: 'mealPlans',
            populate: {
              path: 'mealPlan',
              model: 'MealPlan', // Make sure this matches the model name of the MealPlan model
              populate: {
                path: 'meals',
                model: 'Meal', // Make sure this matches the model name of the Meal model
                populate: {
                  path: 'recipes',
                  model: 'Recipe'
                }
              }
            }
          }).populate({
            path: 'aiChats',
            options: { limit: 3, sort: { createdAt: -1 }}
          }).populate({
            path: 'points',
          });
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (e) {
        console.error(e); // optional, logs the error on your server
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
};

export const updateUser = async (req: Request, res: Response, next?: NextFunction) => {
  console.log('update user')
  const updates = req.body;
  try {
      const user = await User.findById(req.params.id);
      if (!user) {
          return res.status(404).send();
      }
      Object.keys(updates).forEach((update) => user[update] = updates[update]);
      await user.save();
      res.send(user);
  } catch (e) {
      console.error(e); // optional, logs the error on your server
      res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const deleteUser = async (req: Request, res: Response, next?: NextFunction) => {
  try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
          return res.status(404).send();
      }
      res.send(user);
  } catch (e) {
      console.error(e); // optional, logs the error on your server
      res.status(500).json({ error: "An error occurred while processing your request." });
  }
};