// backend/src/routes/response.ts

import express from 'express';
import * as generateMealPlan from '../controllers/internal/generate-meal-plan'

const router = express.Router();

router.post('/', generateMealPlan.generateMealPlan)

export default router;