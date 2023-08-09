import axios, { AxiosResponse } from 'axios';
import dotenv from 'dotenv';
import { Request, Response } from 'express';

export const text_to_image = async (
    req: Request,
    res: Response
): Promise<void> => {
    
    const request = {}
    const config = {headers: {'Content-Type': 'application/json'}};

    try {
        let response: AxiosResponse = await axios.post(
            'https://api.getimg.ai/v1',
            request,
            config
        );


        res.send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};