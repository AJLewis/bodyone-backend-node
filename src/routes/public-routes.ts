import express from 'express';
import authRoutes from './auth-routes';
import * as webhook from '../controllers/external/stable-diffusion/webhook';

const router = express.Router();

router.use('/auth', authRoutes);
router.post('/stablediffusion/webhook', webhook.webhook);

export default router;
