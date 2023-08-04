import { Request, Response } from 'express';
import fetch from 'node-fetch';

export async function getChat(req: Request, res: Response) {
    try {
        const request = await fetch("https://api.bardapi.dev/chat", {
            headers: { Authorization: `Bearer ${process.env.BARD_API_KEY}` },
            method: "POST",
            body: JSON.stringify({ input: req.body.input }),
        });
        console.log(process.env.BARD_API_KEY)
        console.log(request)
        const response:any = await request.json();

        res.json(response.output);
    } catch (err) {
        res.status(500).json({ error: err?.toString() });
    }
}