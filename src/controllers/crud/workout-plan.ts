import express, { NextFunction, Request, Response } from 'express';
import WorkoutPlanModel from '../../models/WorkoutPlan.model'; 

export const createWorkoutPlan = async (req: Request, res: Response, next?: NextFunction) => {
  const workoutPlanData = req.body;
  try {
      const workoutPlan = new WorkoutPlanModel(workoutPlanData);
      await workoutPlan.save();
      res.status(201).send(workoutPlan);
  } catch (e) {
      console.error(e); // optional, logs the error on your server
      res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const getAllWorkoutPlans = async (req: Request, res: Response, next?: NextFunction) => {
  try {
      const users = await WorkoutPlanModel.find({});
      res.send(users);
  } catch (e) {
      console.error(e); // optional, logs the error on your server
      res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const getWorkoutPlan = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const workoutPlan = await WorkoutPlanModel.findById(req.params.id).populate('exercises.exercise');
    if (!workoutPlan) {
      return res.status(404).json({ error: 'WorkoutPlan not found' });
    }
    res.json(workoutPlan);
  } catch (e) {
    console.error(e); // optional, logs the error on your server
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const updateWorkoutPlan = async (req: Request, res: Response, next?: NextFunction) => {
  const updates = req.body;
  try {
      const workoutPlan = await WorkoutPlanModel.findById(req.params.id);
      if (!workoutPlan) {
          return res.status(404).send();
      }
      Object.keys(updates).forEach((update) => workoutPlan[update] = updates[update]);
      await workoutPlan.save();
      res.send(workoutPlan);
  } catch (e) {
      console.error(e); // optional, logs the error on your server
      res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const deleteWorkoutPlan = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const workoutPlan = await WorkoutPlanModel.findByIdAndDelete(req.params.id);
    if (!workoutPlan) {
      return res.status(404).send();
    }
    res.send(workoutPlan);
  } catch (e) {
    console.error(e); // optional, logs the error on your server
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};