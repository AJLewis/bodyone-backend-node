import express, { NextFunction, Request, Response } from 'express';
import ExerciseModel from '../../models/Exercise.model';

export const createExercise = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const { title, description, type, tags, equipment, targetMuscleGroups, videoSearchTerm, safetyInstructions, tips, benefits, variations, warmUp, cooldown, prerequisites, commonMistakes, progression, } = req.body;
    const exercise = new ExerciseModel({ title, description, type, tags, equipment, targetMuscleGroups, videoSearchTerm, safetyInstructions, tips, benefits, variations, warmUp, cooldown, prerequisites, commonMistakes, progression, });
    await exercise.save();

    res.status(201).json({
      message: 'Exercise created successfully',
      exercise,
    });
  } catch (error) {
    console.error(error); // optional, logs the error on your server
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
};

export const getAllExercises = async (req: Request, res: Response, next?: NextFunction) => {
  try {
      const users = await ExerciseModel.find({});
      res.send(users);
  } catch (e) {
      console.error(e); // optional, logs the error on your server
      res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const getExercise = async (req: Request, res: Response, next?: NextFunction) => {
  try {
      const exercise = await ExerciseModel.findById(req.params.id);
      if (!exercise) {
          return res.status(404).send();
      }
      res.send(exercise);
  } catch (e) {
      console.error(e); // optional, logs the error on your server
      res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const deleteExercise = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const exercise = await ExerciseModel.findByIdAndDelete(req.params.id);
    if (!exercise) {
        return res.status(404).send();
    }
    res.send(exercise);
  } catch (e) {
    console.error(e); // optional, logs the error on your server
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};