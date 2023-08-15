// backend/src/routes/response.ts

import express from 'express';
import * as generateMealPlan from '../controllers/functions/generate-meal-plan'

const router = express.Router();

router.post('/multiple', generateMealPlan.generateMealPlans)

export default router;