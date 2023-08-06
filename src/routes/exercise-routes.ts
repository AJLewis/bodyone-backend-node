// backend/src/routes/response.ts

import express from 'express';
import * as exercise from '../controllers/crud/exercise'

const router = express.Router();

router.get('/', exercise.getAllExercises);
router.get('/:id', exercise.getExercise);
router.post('', exercise.createExercise);
router.delete('/:id', exercise.deleteExercise);

export default router;