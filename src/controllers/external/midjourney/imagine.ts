import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import { Midjourney } from 'midjourney';
import { ProductImageModel } from '../../../models/ProductImage.model';
import { randomUUID } from 'crypto';

dotenv.config();

const client = new Midjourney({
    ServerId: process.env.DISCORD_SERVER_ID as string,
    ChannelId: process.env.DISCORD_CHANNEL_ID as string,
    SalaiToken: process.env.DISCORD_SALAI_TOKEN as string,
    Debug: true
});


export const imagine = async (req: Request, res: Response, next?: NextFunction) => {
    (await client.init()).Relax().then( async () => {
      console.log('client initialized');
      try {
        const prompt = req.body.prompt;
        const name = req.body.name;
        
        const images = await client.Imagine(prompt, async (uri: string, progress: string) => {
          console.log('image generated', uri, "progress", progress);
        });
  
        if (images) {
          const upscaledImage = await upscaleAndSaveImages(images, name);
  
          res.json({ upscaledImage });
        } else {
          res.status(500).json({ error: "An error occurred while processing your request." });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while processing your request." });
      }
    }).catch((err: any) => {
      console.error(err);
      res.status(500).json({ error: "An error occurred while processing your request." });
    });
};

export const upscaleAndSaveImages = async (msg: any, name: string) => {
  console.log('upscale and save images');
  const upscaled = await upscale(msg, 0);

  const productImageDoc = new ProductImageModel({
    uri: upscaled?.uri,
    name: name,
    hash: upscaled?.hash,
    content: upscaled?.content,
    progress: upscaled?.progress,
  });

  await productImageDoc.save();

  return productImageDoc;
};

export const upscale = async (msg: any, index?: any) => {
    console.log('upscale local');
    console.log(msg);
    return await client.Upscale(msg.content, index ? index : 1, msg.id as string, msg.hash as string, (uri: string, progress: string) => {
        console.log("loading", uri);
    });
};

