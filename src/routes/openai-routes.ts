// backend/src/routes/response.ts

import express from 'express';
import * as chat from '../controllers/external/openai/chat';
import * as completion from '../controllers/external/openai/completion';
import * as image from '../controllers/external/openai/image';

const router = express.Router();

router.post('/chat', chat.getChat);
router.post('/completion', completion.getCompletion);
router.post('/image', image.getImage);

export default router;