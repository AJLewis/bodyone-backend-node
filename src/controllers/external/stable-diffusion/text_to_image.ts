import axios, { AxiosResponse } from 'axios';
import { Request, Response } from 'express';

interface IRequestBody {
    prompt: string;
    negative_prompt?: string;
    width?: number;
    height?: number;
    samples?: number;
    num_inference_steps?: number;
    self_attention?: string;
    enhance_prompt?: string;
    upscale?: string;
    // Include other parameters as necessary
  }
  
export const text_to_image = async (req: Request, res: Response): Promise<void> => {
  
  const { prompt, negative_prompt, width, height, samples, num_inference_steps, self_attention = 'yes', enhance_prompt = 'yes', upscale = 'yes' } = req.body as IRequestBody;
  const config = {headers: {'Content-Type': 'application/json'}};

  try {
    const response: AxiosResponse = await axios.post('https://stablediffusionapi.com/api/v4/dreambooth', {
      key: process.env.STABLE_DIFFUSION_API_KEY,
      model_id: "midjourney",
      prompt,
      negative_prompt,
      width,
      height,
      samples,
      num_inference_steps,
      self_attention,
      enhance_prompt,
      upscale
    }, config);

    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
}

export const get_queued_image = async (req: Request, res: Response): Promise<void> => {
  const { request_id } = req.body;
  const config = {headers: {'Content-Type': 'application/json'}};

  try {
    const response = await axios.post('https://stablediffusionapi.com/api/v4/dreambooth/fetch', {
      key: process.env.STABLE_DIFFUSION_API_KEY,
      request_id: request_id
    }, config);
    
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
}