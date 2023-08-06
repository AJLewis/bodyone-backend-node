// backend/src/routes/response.ts

import express from 'express';
import * as mealPlan from '../controllers/crud/meal-plan'

const router = express.Router();

router.get('/', mealPlan.getAllMealPlans);
router.get('/:id', mealPlan.getMealPlan);
router.post('/', mealPlan.createMealPlan)
router.patch('/:id', mealPlan.updateMealPlan);
router.delete('/:id', mealPlan.deleteMealPlan);

export default router;