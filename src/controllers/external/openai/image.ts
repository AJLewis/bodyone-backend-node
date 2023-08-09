import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const getImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prompt = req.body.prompt;
        const numImages = req.body.n ? req.body.n : 1;
        const imageSize = req.body.size ? req.body.size : "1024x1024";
        
        const imageResponse = await openai.createImage({
            prompt: prompt,
            n: numImages,
            size: imageSize
        });
        
        const response = imageResponse ? imageResponse?.data : 'Could not find result';
        
        res.json({ response });
    } catch (err) {
        console.error(err); // optional, logs the error on your server
        res.status(500).json({ error: err });
    }
};

export const getImageLocal = async (description: any) => {
    try {
        const prompt = description;
        const numImages = 1;
        const imageSize =  "1024x1024";
        
        const imageResponse = await openai.createImage({
            prompt: prompt,
            n: numImages,
            size: imageSize
        });
        
        return imageResponse ? imageResponse?.data : 'Could not find result';
        
    } catch (err) {
        console.error(err); // optional, logs the error on your server
        return null;
    }
};