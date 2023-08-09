interface IPlan {
  date: Date,
  mealTypes: string[]
}

export interface IGenerateMealPlanConfig {
  plans: IPlan[]
}