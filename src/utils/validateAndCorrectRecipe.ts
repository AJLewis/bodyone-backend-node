export const validateAndCorrectRecipe = (recipe: any) => {
  
  // Validate 'name' as a string
  if (typeof recipe.name !== 'string') {
    recipe.name = String(recipe.name);
  }

  // Validate 'description' as a string
  if (recipe.description && typeof recipe.description !== 'string') {
    recipe.description = String(recipe.description);
  }

  // Validate 'instructions' as an array of strings
  if (!Array.isArray(recipe.instructions)) {
    recipe.instructions = [];
  }

  // Validate 'preparationTime', 'cookingTime', and 'servings' as numbers
  recipe.preparationTime = Number(recipe.preparationTime);
  recipe.cookingTime = Number(recipe.cookingTime) || 0; // Default to 0 if not provided

  // Validate 'cuisine', 'course', and 'diet' as strings
  recipe.cuisine = recipe.cuisine ? String(recipe.cuisine) : '';
  recipe.course = recipe.course ? String(recipe.course) : '';
  recipe.diet = recipe.diet ? String(recipe.diet) : '';

  // Validate 'dietaryRequirements' as an array of strings
  if (!Array.isArray(recipe.dietaryRequirements)) {
    recipe.dietaryRequirements = [];
  }

  return recipe;
}