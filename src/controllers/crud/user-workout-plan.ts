import express, { NextFunction, Request, Response } from 'express';
import UserWorkoutPlanModel from '../../models/UserWorkoutPlan.model'; // Assuming this is the location of your UserWorkoutPlan model

export const createUserWorkoutPlan = async (req: Request, res: Response, next?: NextFunction) => {
  const userWorkoutPlanData = req.body;
  try {
      const userWorkoutPlan = new UserWorkoutPlanModel(userWorkoutPlanData);
      await userWorkoutPlan.save();
      res.status(201).send(userWorkoutPlan);
  } catch (e) {
      console.error(e); // optional, logs the error on your server
      res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const getAllUserWorkoutPlans = async (req: Request, res: Response, next?: NextFunction) => {
  try {
      const users = await UserWorkoutPlanModel.find({});
      res.send(users);
  } catch (e) {
      console.error(e); // optional, logs the error on your server
      res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const getUserWorkoutPlan = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const userWorkoutPlan = await UserWorkoutPlanModel.findById(req.params.id)
      .populate('user')
      .populate('workoutPlan');
    if (!userWorkoutPlan) {
      return res.status(404).json({ error: "UserWorkoutPlan not found" });
    }
    res.json(userWorkoutPlan);
  } catch (e) {
    console.error(e); // optional, logs the error on your server
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const updateUserWorkoutPlan = async (req: Request, res: Response, next?: NextFunction) => {
  const updates = req.body;
  try {
      const userWorkoutPlan = await UserWorkoutPlanModel.findById(req.params.id);
      if (!userWorkoutPlan) {
          return res.status(404).send();
      }
      Object.keys(updates).forEach((update) => userWorkoutPlan[update] = updates[update]);
      await userWorkoutPlan.save();
      res.send(userWorkoutPlan);
  } catch (e) {
      console.error(e); // optional, logs the error on your server
      res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const deleteUserWorkoutPlan = async (req: Request, res: Response, next?: NextFunction) => {
  try {
      const userWorkoutPlan = await UserWorkoutPlanModel.findByIdAndDelete(req.params.id);
      if (!userWorkoutPlan) {
          return res.status(404).send();
      }
      res.send(userWorkoutPlan);
  } catch (e) {
      console.error(e); // optional, logs the error on your server
      res.status(500).json({ error: "An error occurred while processing your request." });
  }
};