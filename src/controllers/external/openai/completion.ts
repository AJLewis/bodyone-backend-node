import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import { Configuration, OpenAIApi } from 'openai';
import { OpenAiCompletionModels } from '../../../constants/openai-models.constant';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const getCompletion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prompt = req.body.prompt
        const model = req.body.model ? req.body.model : OpenAiCompletionModels['textbabbage001'];
        
        const gptResponse = await openai.createCompletion({
            model: model,
            prompt: prompt
        });
        
        const response = gptResponse ? gptResponse?.data : 'Could not find result';
        res.json({ response });
    } catch (err) {
        console.error(err); // optional, logs the error on your server
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
};
