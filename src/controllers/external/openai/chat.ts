import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import { Configuration, CreateChatCompletionResponse, OpenAIApi } from 'openai';
import { OpenAiChatModels } from '../../../constants/openai-models.constant';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration)



export const getChat = async (req: Request, res: Response, next?: NextFunction) => {
    console.log('Getting Chat')
    
    const messages: any[] = req.body.messages
    const model = req.body.model ? req.body.model : OpenAiChatModels['gpt35turbo0613'];
    const temperature = req.body.temperature ? req.body.temperature : 0.9;
    const maxTokens = req.body.maxTokens ? req.body.maxTokens : 2800;
    const functions = req.body.functions ? req.body.functions : null;

    console.log(messages);

    const maxRetries = 20; // You can adjust this
    let retryCount = 0;

    while (retryCount < maxRetries) {
        try {
            const gptResponse = await openai.createChatCompletion({
                model: model,
                messages: messages,
                max_tokens: maxTokens,
                temperature: temperature,
            });

            const response: CreateChatCompletionResponse | null = gptResponse ? gptResponse?.data : null;

            res.json({ response });
            return; // Success, so exit the loop
        } catch (err: any) {
            console.error(`Attempt ${retryCount + 1} failed. Retrying...`);
            console.log(err?.response?.data?.error?.message );
            retryCount++;

            if (retryCount >= maxRetries) {
                res.status(500).json({ error: err?.response?.data?.error?.message });
                return; // Max retries reached, so exit the loop
            }

            const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
            await sleep(delay); // Wait before retrying
            getChat(req, res, next);
            return;
        }
    }
};

export const getChatLocal = async (data:any): Promise<CreateChatCompletionResponse | null> => {
    console.log('sending request to openai')
    try {
        console
        const messages: any[] = data.messages
        const model = data.model ? data.model : OpenAiChatModels['gpt35turbo'];
        const maxTokens = data.maxTokens ? data.maxTokens : 3000;
        
        const gptResponse = await openai.createChatCompletion({
            model: model,
            messages: messages,
            max_tokens: maxTokens
        });

        const response: CreateChatCompletionResponse | null = gptResponse ? gptResponse?.data : null;
        return response

    } catch (err) {
        console.error(err); // optional, logs the error on your server
        return null;
    }
};

export const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};