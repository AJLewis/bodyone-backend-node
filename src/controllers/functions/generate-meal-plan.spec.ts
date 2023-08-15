import { generateMealPlans } from './generate-meal-plan';
import { createMealPlanPrompt } from '../../prompts/create-meal-plan-prompt';

describe('generateMultipleMealPlans', () => {
  const req = {
    body: {
      userId: '64d3f9d0c55d76eb02d731c2',
      config: {
        plans: [
          {
            date: '2023-08-12',
            mealTypes: ['breakfast', 'lunch', 'dinner', 'supper', 'snack'],
          },
        ],
      },
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();

  it('should generate multiple meal plans for a user', async () => {
    const User = {
      findById: jest.fn().mockResolvedValue({
        fitnessGoals: [],
        dietaryRequirements: [],
        allergies: [],
        preferredCuisine: [],
      }),
    };
    const generateAiResponse = jest.fn().mockResolvedValue('parsed meal plan data');

    await generateMealPlans(req as any, res as any, next);

    const user = {
      fitnessGoals: [],
      dietaryRequirements: [],
      allergies: [],
      preferredCuisine: [],
    };

    const config = {
      plans: [
        {
          date: '2023-08-12',
          mealTypes: ['breakfast', 'lunch', 'dinner', 'supper', 'snack'],
        },
      ],
    };

    const responseFormat = createMealPlanPrompt(user as any, config as any);
    
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Meal plans generated successfully',
      userMealPlans: ['created meal plan'],
    });
    expect(generateAiResponse).toHaveBeenCalledWith({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        {
          role: 'user',
          content: `create a delicious meal ideas for each meal in the meal plan. I will then use this json object to create some recipes later. Be creative. Each title must not exceed 8 words, return it in the same format as this ${responseFormat}. The information has been provided. Be creative. Each title must be roughly 8 words`,
        },
      ],
      temperature: 1.2,
    });
  });

  it('should handle missing parameters', async () => {
    await generateMealPlans(req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Missing required parameters',
    });
  });
});