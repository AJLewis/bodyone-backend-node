// backend/src/routes/response.ts

import express from 'express';
import * as workoutplan from '../controllers/internal/workout-plan'

const router = express.Router();

router.get('/', workoutplan.getAllWorkoutPlans);
router.get('/:id', workoutplan.getWorkoutPlan);
router.post('/', workoutplan.createWorkoutPlan);
router.patch('/:id', workoutplan.updateWorkoutPlan);
router.delete('/:id', workoutplan.deleteWorkoutPlan);

export default router;