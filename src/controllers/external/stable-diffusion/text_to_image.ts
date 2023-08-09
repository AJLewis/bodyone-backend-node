import axios, {AxiosResponse} from 'axios';
import {Request, Response} from 'express';

interface IRequestBody {
    prompt: string;
    negative_prompt?: string;
    width?: string;
    height?: string;
    samples?: string;
    num_inference_steps?: string;
    self_attention?: string;
    enhance_prompt?: string;
    upscale?: string;
    webhook?: string;
    // Include other parameters as necessary
}

export const text_to_image = async (
    req: Request,
    res: Response
): Promise<void> => {
    const {
        prompt,
        negative_prompt,
        width,
        height,
        samples,
        num_inference_steps,
        self_attention,
        enhance_prompt,
        upscale,
        webhook
    } = req.body as IRequestBody;

    const request = {
        key: process.env.STABLE_DIFFUSION_API_KEY,
        model_id: 'midjourney',
        prompt: prompt,
        negative_prompt: negative_prompt,
        width: width ? width : '1024',
        height: height ? height : '1024',
        samples: samples ? samples : 1,
        num_inference_steps: num_inference_steps ? num_inference_steps : 51,
        safety_checker: 'yes',
        enhance_prompt: enhance_prompt ? enhance_prompt : 'yes',
        seed: null,
        guidance_scale: 7.5,
        multi_lingual: 'no',
        panorama: 'yes',
        self_attention: 'yes',
        upscale: upscale ? upscale : 'no',
        embeddings_model: null,
        webhook: webhook ? webhook : `${process.env.NGROK}${process.env.API_PUBLIC_LINK}/stablediffusion/webhook`,
        track_id: null,
    };

    const config = {headers: {'Content-Type': 'application/json'}};

    try {
        let response: AxiosResponse = await axios.post(
            'https://stablediffusionapi.com/api/v3/text2img',
            request,
            config
        );

        res.send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

export const get_queued_image = async (
    req: Request,
    res: Response
): Promise<void> => {
    const {request_id} = req.body;
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
