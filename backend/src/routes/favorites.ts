import { Router } from 'express';
import {
  addFavorite,
  removeFavorite,
  getFavorites,
  clearFavorites,
} from '../controllers/favoritesController';

const router = Router();

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Get all favorite recipes
 *     tags: [Favorites]
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/', getFavorites);

/**
 * @swagger
 * /api/favorites:
 *   post:
 *     summary: Add recipe to favorites
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipeId
 *             properties:
 *               recipeId:
 *                 type: number
 *     responses:
 *       201:
 *         description: Recipe added to favorites
 */
router.post('/', addFavorite);

/**
 * @swagger
 * /api/favorites/{id}:
 *   delete:
 *     summary: Remove recipe from favorites
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Recipe removed from favorites
 */
router.delete('/:id', removeFavorite);

/**
 * @swagger
 * /api/favorites/clear:
 *   delete:
 *     summary: Clear all favorites
 *     tags: [Favorites]
 *     responses:
 *       200:
 *         description: All favorites cleared
 */
router.delete('/clear/all', clearFavorites);

export default router;
