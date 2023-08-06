// backend/src/routes/response.ts

import express from 'express';
import * as generateMealPlan from '../controllers/functions/generate-meal-plan'

const router = express.Router();

router.post('/single', generateMealPlan.generateSingleMealPlan)
router.post('/multiple', generateMealPlan.generateMultipleMealPlans)

export default router;