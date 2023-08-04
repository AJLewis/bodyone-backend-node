// backend/src/routes/response.ts

import express from 'express';
import * as userMeal from '../controllers/internal/user-meal-plan'

const router = express.Router();
router.get('/', userMeal.getAllUserMealPlans);
router.get('/:id', userMeal.getUserMealPlan);
router.post('/', userMeal.createUserMealPlan)
router.patch('/:id', userMeal.updateUserMealPlan);
router.delete('/:id', userMeal.deleteUserMealPlan);

export default router;