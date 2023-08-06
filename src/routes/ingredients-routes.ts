// backend/src/routes/response.ts

import express from 'express';
import * as ingredients from '../controllers/crud/ingredients'

const router = express.Router();

router.get('/', ingredients.getAllIngredients);
router.get('/:id', ingredients.getIngredient);
router.post('/', ingredients.createIngredient);
router.post('/multiple', ingredients.createIngredients);
router.delete('/:id', ingredients.deleteIngredient);

export default router;