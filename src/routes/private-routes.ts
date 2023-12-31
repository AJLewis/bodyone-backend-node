import express from 'express';

import openAiRoutes from './openai-routes';
import stableDiffusionRoutes from './stable-diffusion-routes';
import userRoutes from './user-routes';
import exerciseRoutes from './exercise-routes';
import workoutPlanRoutes from './workoutplan-routes';
import userWorkoutPlanRoutes from './user-workoutplan-routes';
import ingredientRoutes from './ingredients-routes';
import recipeRoutes from './recipe-routes';
import mealRoutes from './meal-routes';
import userMealPlansRoutes from './user-meal-plan-routes';
import mealPlansRoutes from './meal-plan-routes';
import aiCoach from './ai-coach-routes';
import points from './points-routes';
import notification from './notification-routes';
import message from './message-routes';
import generateMealPlan from './generate-meal-plan-routes';
import rapid from './rapid-api-routes';
import midjourneyRoutes from './midjourney-routes';

const router = express.Router();

router.use('/openai', openAiRoutes);
router.use('/stablediffusion', stableDiffusionRoutes);
router.use('/user', userRoutes)
router.use('/exercise', exerciseRoutes)
router.use('/workoutplan', workoutPlanRoutes)
router.use('/userworkoutplan', userWorkoutPlanRoutes)
router.use('/ingredient', ingredientRoutes)
router.use('/recipe', recipeRoutes)
router.use('/meal', mealRoutes)
router.use('/mealplan', mealPlansRoutes)
router.use('/usermealplan', userMealPlansRoutes)
router.use('/aicoach', aiCoach)
router.use('/points', points)
router.use('/notification', notification)
router.use('/message', message)
router.use('/generatemealplan', generateMealPlan)
router.use('/rapid', rapid)
router.use('/midjourney', midjourneyRoutes)

export default router;
