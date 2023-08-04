import axios, { AxiosResponse } from 'axios';
import { Request, Response } from 'express';

interface IRequestBody {
    prompt: string;
    negative_prompt?: string;
    scheduler?: number;
    seconds?: number;
    // Include other parameters as necessary
  }
  
export const text_to_video = async (req: Request, res: Response): Promise<void> => {
  
  const { prompt, negative_prompt, scheduler, seconds } = req.body as IRequestBody;
  const config = {headers: {'Content-Type': 'application/json'}};

  try {
    const response: AxiosResponse = await axios.post('https://stablediffusionapi.com/api/v5/text2video', {
      key: process.env.STABLE_DIFFUSION_API_KEY,
      prompt,
      negative_prompt,
      scheduler,
      seconds
    }, config);

    res.send(response.data);

  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
}

