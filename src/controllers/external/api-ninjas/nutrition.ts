import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

export const getNutritionInfo = async (req: Request, res: Response, next?: NextFunction) => {
  try {
    const { query } = req.body;

    const options = {
      method: 'GET',
      url: 'https://nutrition-by-api-ninjas.p.rapidapi.com/v1/nutrition',
      params: {
        query: query
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'nutrition-by-api-ninjas.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);

    res.status(200).json({
      message: 'Nutrition information retrieved successfully',
      data: response.data,
    });
  } catch (error) {
    console.error(error); // optional, logs the error on your server
    res.status(500).json({ error: error });
  }
};