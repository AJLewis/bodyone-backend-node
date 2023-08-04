// backend/src/routes/response.ts

import express from 'express';

import * as chat from '../controllers/external/bard/chat';

const router = express.Router();

router.post('/chat', chat.getChat);
export default router;