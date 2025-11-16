import axios, { AxiosInstance } from 'axios';
import { config } from '../config';
import { Recipe, SearchParams } from '../types';
import { AppError } from '../middleware/errorHandler';
import { redisService } from '../config/redis';
import { logger } from '../config/logger';

class SpoonacularService {
  private api: AxiosInstance;
  private readonly cachePrefix = 'spoonacular:';
  private readonly cacheTTL = config.spoonacular.cacheTTL;

  constructor() {
    this.api = axios.create({
      baseURL: config.spoonacular.baseUrl,
      params: {
        apiKey: config.spoonacular.apiKey,
      },
    });
  }

  private generateCacheKey(endpoint: string, params: object): string {
    const paramsString = JSON.stringify(params);
    return `${this.cachePrefix}${endpoint}:${Buffer.from(paramsString).toString('base64')}`;
  }

  async searchRecipes(params: SearchParams): Promise<{ results: Recipe[]; totalResults: number }> {
    const cacheKey = this.generateCacheKey('search', params);

    // Try cache first
    const cached = await redisService.get(cacheKey);
    if (cached) {
      logger.debug('Cache hit for recipe search');
      return JSON.parse(cached);
    }

    try {
      logger.debug('API call to Spoonacular for recipe search');

      const response = await this.api.get('/recipes/complexSearch', {
        params: {
          query: params.query,
          cuisine: params.cuisine,
          diet: params.diet,
          intolerances: params.intolerances,
          type: params.type,
          maxReadyTime: params.maxReadyTime,
          minCalories: params.minCalories,
          maxCalories: params.maxCalories,
          minProtein: params.minProtein,
          maxProtein: params.maxProtein,
          minCarbs: params.minCarbs,
          maxCarbs: params.maxCarbs,
          minFat: params.minFat,
          maxFat: params.maxFat,
          number: params.number || 10,
          offset: params.offset || 0,
          addRecipeInformation: true,
          fillIngredients: true,
          addRecipeNutrition: true,
        },
      });

      const result = {
        results: response.data.results,
        totalResults: response.data.totalResults,
      };

      // Cache the result
      await redisService.set(cacheKey, JSON.stringify(result), this.cacheTTL);

      return result;
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  async getRecipeById(id: number): Promise<Recipe> {
    const cacheKey = this.generateCacheKey('recipe', { id });

    // Try cache first
    const cached = await redisService.get(cacheKey);
    if (cached) {
      logger.debug(`Cache hit for recipe ${id}`);
      return JSON.parse(cached);
    }

    try {
      logger.debug(`API call to Spoonacular for recipe ${id}`);

      const response = await this.api.get(`/recipes/${id}/information`, {
        params: {
          includeNutrition: true,
        },
      });

      const recipe = response.data;

      // Cache the result
      await redisService.set(cacheKey, JSON.stringify(recipe), this.cacheTTL);

      return recipe;
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  async getSimilarRecipes(id: number, limit = 3): Promise<Recipe[]> {
    const cacheKey = this.generateCacheKey('similar', { id, limit });

    // Try cache first
    const cached = await redisService.get(cacheKey);
    if (cached) {
      logger.debug(`Cache hit for similar recipes of ${id}`);
      return JSON.parse(cached);
    }

    try {
      logger.debug(`API call to Spoonacular for similar recipes of ${id}`);

      const response = await this.api.get(`/recipes/${id}/similar`, {
        params: {
          number: limit,
        },
      });

      const recipes = response.data;

      // Cache the result
      await redisService.set(cacheKey, JSON.stringify(recipes), this.cacheTTL);

      return recipes;
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  async getRecipesByIngredients(ingredients: string[], number = 10): Promise<Recipe[]> {
    const cacheKey = this.generateCacheKey('byIngredients', { ingredients, number });

    // Try cache first
    const cached = await redisService.get(cacheKey);
    if (cached) {
      logger.debug('Cache hit for recipes by ingredients');
      return JSON.parse(cached);
    }

    try {
      logger.debug('API call to Spoonacular for recipes by ingredients');

      const response = await this.api.get('/recipes/findByIngredients', {
        params: {
          ingredients: ingredients.join(','),
          number,
          ranking: 2,
          ignorePantry: true,
        },
      });

      const recipes = response.data;

      // Cache the result
      await redisService.set(cacheKey, JSON.stringify(recipes), this.cacheTTL);

      return recipes;
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  async getRandomRecipes(number = 10, tags?: string): Promise<Recipe[]> {
    // Don't cache random recipes - they should be different each time
    try {
      logger.debug('API call to Spoonacular for random recipes');

      const response = await this.api.get('/recipes/random', {
        params: {
          number,
          tags,
        },
      });

      return response.data.recipes;
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  private handleApiError(error: unknown): void {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Spoonacular API error';

        logger.error(`Spoonacular API error: ${status} - ${message}`);

        if (status === 401) {
          throw new AppError('Invalid API key', 401, 'INVALID_API_KEY');
        } else if (status === 402) {
          throw new AppError('API quota exceeded', 402, 'QUOTA_EXCEEDED');
        } else if (status === 404) {
          throw new AppError('Recipe not found', 404, 'NOT_FOUND');
        } else {
          throw new AppError(message, status);
        }
      } else if (error.request) {
        logger.error('Unable to reach Spoonacular API');
        throw new AppError('Unable to reach Spoonacular API', 503, 'SERVICE_UNAVAILABLE');
      }
    }
    logger.error('Unexpected error in Spoonacular service', error);
    throw new AppError('An unexpected error occurred', 500);
  }
}

export default new SpoonacularService();
