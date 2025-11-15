export interface Recipe {
  id: number;
  title: string;
  image: string;
  imageType?: string;
  readyInMinutes?: number;
  servings?: number;
  sourceUrl?: string;
  summary?: string;
  cuisines?: string[];
  dishTypes?: string[];
  diets?: string[];
  occasions?: string[];
  instructions?: string;
  analyzedInstructions?: AnalyzedInstruction[];
  extendedIngredients?: Ingredient[];
  nutrition?: Nutrition;
  isFavorite?: boolean;
}

export interface Ingredient {
  id: number;
  name: string;
  original: string;
  amount: number;
  unit: string;
  image?: string;
  meta?: string[];
}

export interface AnalyzedInstruction {
  name: string;
  steps: Step[];
}

export interface Step {
  number: number;
  step: string;
  ingredients?: {
    id: number;
    name: string;
    image?: string;
  }[];
  equipment?: {
    id: number;
    name: string;
    image?: string;
  }[];
}

export interface Nutrition {
  nutrients: Nutrient[];
  caloricBreakdown?: {
    percentProtein: number;
    percentFat: number;
    percentCarbs: number;
  };
}

export interface Nutrient {
  name: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds?: number;
}

export interface SearchParams {
  query?: string;
  cuisine?: string;
  diet?: string;
  intolerances?: string;
  type?: string;
  maxReadyTime?: number;
  minCalories?: number;
  maxCalories?: number;
  minProtein?: number;
  maxProtein?: number;
  minCarbs?: number;
  maxCarbs?: number;
  minFat?: number;
  maxFat?: number;
  number?: number;
  offset?: number;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  purchased: boolean;
  recipeId?: number;
  recipeName?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}
