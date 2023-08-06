// backend/src/routes/response.ts

import express from 'express';
import * as points from '../controllers/crud/points'

const router = express.Router();
router.get('/', points.getAllPoints);
router.get('/:id', points.getPoints);
router.post('/', points.createPoints);
router.patch('/:id', points.updatePoints);
router.delete('/:id', points.deletePoints);

export default router;