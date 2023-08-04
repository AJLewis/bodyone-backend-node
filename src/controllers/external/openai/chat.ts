import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import { Configuration, CreateChatCompletionResponse, OpenAIApi } from 'openai';
import { OpenAiChatModels } from '../../../constants/openai-models.constant';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const getChat = async (req: Request, res: Response, next?: NextFunction) => {
    console.log('GETTING CHAT')
    try {
        const messages: any[] = req.body.messages
        const model = req.body.model ? req.body.model : OpenAiChatModels['gpt35turbo'];
        const maxTokens = req.body.maxTokens ? req.body.maxTokens : 3000;
        
        console.log(messages);
        console.log(model);
        console.log(maxTokens);
        const sleep = () => new Promise(r => setTimeout(r, 1000));
        
        const gptResponse = await openai.createChatCompletion({
            model: model,
            messages: messages,
            max_tokens: maxTokens
        });

        console.log(gptResponse)
        
        const response: CreateChatCompletionResponse | null = gptResponse ? gptResponse?.data : null;
        
        res.json({ response });
    } catch (err) {
        res.status(500).json({ error: err });
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