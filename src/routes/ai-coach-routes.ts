// backend/src/routes/response.ts

import express from 'express';
import * as aicoach from '../controllers/internal/ai-coach'

const router = express.Router();

router.get('/getall/:userid', aicoach.getAllConversationsForUser);
router.get('/single/:id', aicoach.getConversation);
router.post('/start', aicoach.startConversation);
router.patch('/add/:id', aicoach.addMessage);
router.delete('/delete/:id', aicoach.deleteConversation);

export default router;