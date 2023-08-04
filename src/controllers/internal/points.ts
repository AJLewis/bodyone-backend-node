import express, { NextFunction, Request, Response } from 'express';
import PointsModel from '../../models/Pts.model';

export const createPoints = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const pointsData = req.body;
    const points = new PointsModel(pointsData);
    await points.save();

    res.status(201).json({
      message: 'Points created successfully',
      points,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
};

export const getAllPoints = async (req: Request, res: Response, next?: NextFunction) => {
  try {
      const points = await PointsModel.find({});
      res.send(points);
  } catch (e) {
      console.error(e);
      res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const getPoints = async (req: Request, res: Response, next?: NextFunction) => {
  try {
      const points = await PointsModel.findById(req.params.id);
      if (!points) {
          return res.status(404).send();
      }
      res.send(points);
  } catch (e) {
      console.error(e);
      res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const updatePoints = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const points = await PointsModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!points) {
        return res.status(404).send();
    }
    res.send(points);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const deletePoints = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const points = await PointsModel.findByIdAndDelete(req.params.id);
    if (!points) {
        return res.status(404).send();
    }
    res.send(points);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};