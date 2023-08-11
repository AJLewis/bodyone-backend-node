import axios, {AxiosResponse} from 'axios';
import {Request, Response} from 'express';
import fs from 'fs';
import path from 'path';

export const text_to_image = async (
    req: Request,
    res: Response
): Promise<void> => {
    const {prompt, name} = req.body;
    const model= "stable-diffusion-xl-beta-v2-2-2";
    const url = `https://api.stability.ai/v1/generation/${model}/text-to-image`;
    const steps = 50;

    const request = {
        steps: steps,
        width: 512,
        height: 512,
        seed: 0,
        cfg_scale: 7,
        samples: 1,
        style_preset: 'photographic',
        text_prompts: [
            {
                text: prompt,
                weight: 1,
            },
            {
                text: 'text',
                weight: -1,
            },
            {
                text: 'hands',
                weight: -1,
            },
            {
                text: 'people',
                weight: -1,
            }
        ],
    };

    const headers = {
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.STABLE_DIFFUSION_API_KEY}`,
    };

    try {
        const response = await axios.post(url, request, {headers});
        let imagePath;
        response.data.artifacts.forEach((image: any, index: number) => {
            const imgPath = path.join(
                __dirname,
                '../../../',
                'images',
                'recipe-images',
                `${name.replaceAll(' ', '_')}_${image.seed}_${model}_steps_${steps}.png`
            );
            fs.writeFileSync(imgPath, Buffer.from(image.base64, 'base64'));
            imagePath = `/images/recipe-images/${name.replaceAll(' ', '_')}_${image.seed}_${model}_steps_${steps}.png`
        });

        const result = {
            image: imagePath,
            status: "success"
        };

        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};
