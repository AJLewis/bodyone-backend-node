
import express from 'express';
import { checkUserToken } from '../controllers/internal/authentication';
import privateRoutes from './private-routes';
import publicRoutes from './public-routes';

const router = express.Router();


router.use('/public', publicRoutes);
router.use('/private', checkUserToken, privateRoutes);

// router.use('/bard', bardRoutes);

export default router;