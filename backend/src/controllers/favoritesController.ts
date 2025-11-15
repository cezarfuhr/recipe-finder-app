import { Request, Response, NextFunction } from 'express';
import favoritesService from '../services/favoritesService';
import spoonacularService from '../services/spoonacularService';
import { AppError } from '../middleware/errorHandler';

export const addFavorite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] as string || 'anonymous';
    const { recipeId } = req.body;

    if (!recipeId) {
      throw new AppError('Recipe ID is required', 400, 'INVALID_REQUEST');
    }

    favoritesService.addFavorite(userId, recipeId);
    res.status(201).json({ message: 'Recipe added to favorites', recipeId });
  } catch (error) {
    next(error);
  }
};

export const removeFavorite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] as string || 'anonymous';
    const recipeId = Number(req.params.id);

    const removed = favoritesService.removeFavorite(userId, recipeId);

    if (!removed) {
      throw new AppError('Recipe not found in favorites', 404, 'NOT_FOUND');
    }

    res.json({ message: 'Recipe removed from favorites', recipeId });
  } catch (error) {
    next(error);
  }
};

export const getFavorites = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] as string || 'anonymous';
    const favoriteIds = favoritesService.getFavorites(userId);

    // Fetch full recipe details for each favorite
    const recipePromises = favoriteIds.map(id =>
      spoonacularService.getRecipeById(id).catch(() => null)
    );

    const recipes = (await Promise.all(recipePromises)).filter(recipe => recipe !== null);
    const recipesWithFavorites = favoritesService.markRecipesAsFavorites(userId, recipes);

    res.json(recipesWithFavorites);
  } catch (error) {
    next(error);
  }
};

export const clearFavorites = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] as string || 'anonymous';
    favoritesService.clearFavorites(userId);
    res.json({ message: 'All favorites cleared' });
  } catch (error) {
    next(error);
  }
};
