import axios from 'axios';
import {Request, Response} from 'express';

export const fetch_from_queue = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { request_id } = req.body;
    const config = {headers: {'Content-Type': 'application/json'}};

    try {
        const response = await axios.post(
            'https://stablediffusionapi.com/api/v4/dreambooth/fetch',
            {
                key: process.env.STABLE_DIFFUSION_API_KEY,
                request_id: request_id,
            },
            config
        );

        res.send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};
