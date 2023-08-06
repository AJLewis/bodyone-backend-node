// backend/src/routes/response.ts

import express from 'express';
import * as recipe from '../controllers/crud/recipe'

const router = express.Router();

router.get('/', recipe.getAllRecipes);
router.get('/:id', recipe.getRecipe);
router.post('', recipe.createRecipe);
router.patch('', recipe.updateRecipe);
router.delete('/:id', recipe.deleteRecipe);

export default router;