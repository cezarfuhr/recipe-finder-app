import { Router } from 'express';
import {
  searchRecipes,
  getRecipeById,
  getSimilarRecipes,
  getRecipesByIngredients,
  getRandomRecipes,
} from '../controllers/recipesController';

const router = Router();

/**
 * @swagger
 * /api/recipes/search:
 *   get:
 *     summary: Search recipes with filters
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: cuisine
 *         schema:
 *           type: string
 *         description: Cuisine type
 *       - in: query
 *         name: diet
 *         schema:
 *           type: string
 *         description: Diet type (e.g., vegetarian, vegan)
 *       - in: query
 *         name: maxCalories
 *         schema:
 *           type: number
 *         description: Maximum calories
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/search', searchRecipes);

/**
 * @swagger
 * /api/recipes/random:
 *   get:
 *     summary: Get random recipes
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: number
 *         schema:
 *           type: number
 *         description: Number of recipes to return
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Tags to filter recipes
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/random', getRandomRecipes);

/**
 * @swagger
 * /api/recipes/by-ingredients:
 *   get:
 *     summary: Find recipes by ingredients
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: ingredients
 *         schema:
 *           type: string
 *         description: Comma-separated list of ingredients
 *       - in: query
 *         name: number
 *         schema:
 *           type: number
 *         description: Number of recipes to return
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/by-ingredients', getRecipesByIngredients);

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Get recipe by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Recipe not found
 */
router.get('/:id', getRecipeById);

/**
 * @swagger
 * /api/recipes/{id}/similar:
 *   get:
 *     summary: Get similar recipes
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Recipe ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Number of similar recipes to return
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/:id/similar', getSimilarRecipes);

export default router;
