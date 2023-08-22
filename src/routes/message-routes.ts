import express from 'express';
import * as message from '../controllers/crud/message';  // Import the message service functions

const router = express.Router();

router.get('/user/:id', message.getAllMessages);
router.get('/:id', message.getMessage);
router.post('/', message.createMessage);
router.delete('/:id', message.deleteMessage);

export default router;