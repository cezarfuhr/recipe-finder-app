import { Request, Response, NextFunction } from 'express';
import spoonacularService from '../services/spoonacularService';
import favoritesService from '../services/favoritesService';
import { SearchParams } from '../types';

export const searchRecipes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] as string || 'anonymous';
    const searchParams: SearchParams = {
      query: req.query.query as string,
      cuisine: req.query.cuisine as string,
      diet: req.query.diet as string,
      intolerances: req.query.intolerances as string,
      type: req.query.type as string,
      maxReadyTime: req.query.maxReadyTime ? Number(req.query.maxReadyTime) : undefined,
      minCalories: req.query.minCalories ? Number(req.query.minCalories) : undefined,
      maxCalories: req.query.maxCalories ? Number(req.query.maxCalories) : undefined,
      minProtein: req.query.minProtein ? Number(req.query.minProtein) : undefined,
      maxProtein: req.query.maxProtein ? Number(req.query.maxProtein) : undefined,
      minCarbs: req.query.minCarbs ? Number(req.query.minCarbs) : undefined,
      maxCarbs: req.query.maxCarbs ? Number(req.query.maxCarbs) : undefined,
      minFat: req.query.minFat ? Number(req.query.minFat) : undefined,
      maxFat: req.query.maxFat ? Number(req.query.maxFat) : undefined,
      number: req.query.number ? Number(req.query.number) : 10,
      offset: req.query.offset ? Number(req.query.offset) : 0,
    };

    const result = await spoonacularService.searchRecipes(searchParams);
    const recipesWithFavorites = favoritesService.markRecipesAsFavorites(userId, result.results);

    res.json({
      results: recipesWithFavorites,
      totalResults: result.totalResults,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecipeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] as string || 'anonymous';
    const recipeId = Number(req.params.id);

    const recipe = await spoonacularService.getRecipeById(recipeId);
    recipe.isFavorite = favoritesService.isFavorite(userId, recipeId);

    res.json(recipe);
  } catch (error) {
    next(error);
  }
};

export const getSimilarRecipes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] as string || 'anonymous';
    const recipeId = Number(req.params.id);
    const limit = req.query.limit ? Number(req.query.limit) : 3;

    const recipes = await spoonacularService.getSimilarRecipes(recipeId, limit);
    const recipesWithFavorites = favoritesService.markRecipesAsFavorites(userId, recipes);

    res.json(recipesWithFavorites);
  } catch (error) {
    next(error);
  }
};

export const getRecipesByIngredients = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] as string || 'anonymous';
    const ingredients = (req.query.ingredients as string)?.split(',') || [];
    const number = req.query.number ? Number(req.query.number) : 10;

    const recipes = await spoonacularService.getRecipesByIngredients(ingredients, number);
    const recipesWithFavorites = favoritesService.markRecipesAsFavorites(userId, recipes);

    res.json(recipesWithFavorites);
  } catch (error) {
    next(error);
  }
};

export const getRandomRecipes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] as string || 'anonymous';
    const number = req.query.number ? Number(req.query.number) : 10;
    const tags = req.query.tags as string;

    const recipes = await spoonacularService.getRandomRecipes(number, tags);
    const recipesWithFavorites = favoritesService.markRecipesAsFavorites(userId, recipes);

    res.json(recipesWithFavorites);
  } catch (error) {
    next(error);
  }
};
