// backend/src/routes/response.ts

import express from 'express';
import * as meal from '../controllers/crud/meal'

const router = express.Router();
router.get('/', meal.getAllMeals);
router.get('/:id', meal.getMeal);
router.post('/', meal.createMeal)
router.patch('/:id', meal.updateMeal);
router.delete('/:id', meal.deleteMeal);

export default router;