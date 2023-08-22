import express, { NextFunction, Request, Response } from 'express';
import NotificationModel from '../../models/Notification.model';

export const createNotification = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const { user, content } = req.body;
    const notification = new NotificationModel({ user, content, date: new Date() });
    await notification.save();

    res.status(201).json({
      message: 'Notification created successfully',
      notification,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
};

export const getUserNotifications = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const userId = req.params.id;
    const notifications = await NotificationModel.find({ user: userId });
    res.send(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching notifications.' });
  }
};

export const getNotification = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const notificationId = req.params.id;
    const notification = await NotificationModel.findById(notificationId);
    if (!notification) {
      return res.status(404).send();
    }
    res.send(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the notification.' });
  }
};

export const markNotificationAsViewed = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const notificationId = req.params.id;
    const notification = await NotificationModel.findByIdAndUpdate(notificationId, { viewed: true }, { new: true });
    if (!notification) {
      return res.status(404).send();
    }
    res.send(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the notification.' });
  }
};

export const deleteNotification = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const notificationId = req.params.id;
    const notification = await NotificationModel.findByIdAndDelete(notificationId);
    if (!notification) {
      return res.status(404).send();
    }
    res.send(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the notification.' });
  }
};