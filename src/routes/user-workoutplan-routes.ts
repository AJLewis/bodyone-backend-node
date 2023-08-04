// backend/src/routes/response.ts

import express from 'express';
import * as userWorkoutplans from '../controllers/internal/user-workout-plan'

const router = express.Router();

router.get('/', userWorkoutplans.getAllUserWorkoutPlans);
router.get('/:id', userWorkoutplans.getUserWorkoutPlan);
router.post('/', userWorkoutplans.createUserWorkoutPlan);
router.patch('/:id', userWorkoutplans.updateUserWorkoutPlan);
router.delete('/:id', userWorkoutplans.deleteUserWorkoutPlan);

export default router;