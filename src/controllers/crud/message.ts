import express, { NextFunction, Request, Response } from 'express';
import MessageModel from '../../models/Message.model';

export const createMessage = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const { sender, receiver, previousMessage, subject, content, date, viewed } = req.body;
    const userMessage = new MessageModel({ sender, receiver, previousMessage, subject, content, date, viewed });
    await userMessage.save();

    res.status(201).json({
      message: 'Message created successfully',
      userMessage,
    });
  } catch (error) {
    console.error(error); // optional, logs the error on your server
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
};

export const getAllMessages = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const userId = req.params.id; // Assuming you're passing the user ID as a route parameter
    const type = req.body.type; // Get the type from query parameters

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    let query = {};

    switch (type) {
      case 'sent':
        query = { sender: userId };
        break;
      case 'received':
        query = { receiver: userId };
        break;
      case 'all':
        query = {
          $or: [
            { sender: userId },
            { receiver: userId }
          ]
        };
        break;
      default:
        return res.status(400).json({ error: "Invalid type. Use 'sent', 'received', or 'all'." });
    }

    const messages = await MessageModel.find(query);

    res.send(messages);
  } catch (e) {
    console.error(e); // optional, logs the error on your server
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const getMessage = async (req: Request, res: Response, next?: NextFunction) => {
  try {
      const message = await MessageModel.findById(req.params.id);
      if (!message) {
          return res.status(404).send();
      }
      res.send(message);
  } catch (e) {
      console.error(e); // optional, logs the error on your server
      res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const deleteMessage = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const message = await MessageModel.findByIdAndDelete(req.params.id);
    if (!message) {
        return res.status(404).send();
    }
    res.send(message);
  } catch (e) {
    console.error(e); // optional, logs the error on your server
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};