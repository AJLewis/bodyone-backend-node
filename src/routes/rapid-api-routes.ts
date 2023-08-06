// backend/src/routes/response.ts

import express from 'express';
import * as nutrition from '../controllers/external/api-ninjas/nutrition'

const router = express.Router();
router.get('/nutrition', nutrition.getNutritionInfo);

export default router;