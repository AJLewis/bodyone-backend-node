import { IGenerateMealPlanConfig } from "../interfaces/IGenerateMealPlanConfig";
import { IUserDocument } from "../models/User.model";

export const createMealPlanPrompt = (user: IUserDocument, config: IGenerateMealPlanConfig): string => {
  const dietaryRequirements = user.dietaryRequirements.join('", "');
  const fitnessGoals = user.fitnessGoals.join('", "');
  const preferredCuisine = user.preferredCuisine.join('", "');
  const allergies = user.allergies.join('", "');

  const mealPlans = config.plans.map((plan) => {
    const date = plan.date;
    const meals = plan.mealTypes.map((mealType) => {
      return `{"${mealType}": "{mealTitleHere}"}`;
    }).join(',\n        ');

    return `{
        "date": "${date}",
        "meals": [
          ${meals}
        ]
      }`;
  }).join(',\n      ');

  const responseFormat = `{
    "foodPreferences": {
      "dietaryRequirements": ["${dietaryRequirements}"],
      "fitnessGoals": ["${fitnessGoals}"],
      "preferredCuisine": ["${preferredCuisine}"],
      "allergies": ["${allergies}"]
    },
    "mealPlans": [
      ${mealPlans}
    ]
  }`;

  return responseFormat;
}