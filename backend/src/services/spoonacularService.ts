import axios, { AxiosInstance } from 'axios';
import { config } from '../config';
import { Recipe, SearchParams } from '../types';
import { AppError } from '../middleware/errorHandler';

class SpoonacularService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: config.spoonacular.baseUrl,
      params: {
        apiKey: config.spoonacular.apiKey,
      },
    });
  }

  async searchRecipes(params: SearchParams): Promise<{ results: Recipe[]; totalResults: number }> {
    try {
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

      return {
        results: response.data.results,
        totalResults: response.data.totalResults,
      };
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  async getRecipeById(id: number): Promise<Recipe> {
    try {
      const response = await this.api.get(`/recipes/${id}/information`, {
        params: {
          includeNutrition: true,
        },
      });

      return response.data;
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  async getSimilarRecipes(id: number, limit = 3): Promise<Recipe[]> {
    try {
      const response = await this.api.get(`/recipes/${id}/similar`, {
        params: {
          number: limit,
        },
      });

      return response.data;
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  async getRecipesByIngredients(ingredients: string[], number = 10): Promise<Recipe[]> {
    try {
      const response = await this.api.get('/recipes/findByIngredients', {
        params: {
          ingredients: ingredients.join(','),
          number,
          ranking: 2,
          ignorePantry: true,
        },
      });

      return response.data;
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  async getRandomRecipes(number = 10, tags?: string): Promise<Recipe[]> {
    try {
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
        throw new AppError('Unable to reach Spoonacular API', 503, 'SERVICE_UNAVAILABLE');
      }
    }
    throw new AppError('An unexpected error occurred', 500);
  }
}

export default new SpoonacularService();
