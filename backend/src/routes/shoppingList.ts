import { Router } from 'express';
import {
  getShoppingList,
  addItem,
  addItems,
  updateItem,
  removeItem,
  clearList,
  clearPurchased,
} from '../controllers/shoppingListController';

const router = Router();

/**
 * @swagger
 * /api/shopping-list:
 *   get:
 *     summary: Get shopping list
 *     tags: [Shopping List]
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/', getShoppingList);

/**
 * @swagger
 * /api/shopping-list:
 *   post:
 *     summary: Add item to shopping list
 *     tags: [Shopping List]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - amount
 *               - unit
 *             properties:
 *               name:
 *                 type: string
 *               amount:
 *                 type: number
 *               unit:
 *                 type: string
 *               recipeId:
 *                 type: number
 *               recipeName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Item added to shopping list
 */
router.post('/', addItem);

/**
 * @swagger
 * /api/shopping-list/bulk:
 *   post:
 *     summary: Add multiple items to shopping list
 *     tags: [Shopping List]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Items added to shopping list
 */
router.post('/bulk', addItems);

/**
 * @swagger
 * /api/shopping-list/{id}:
 *   put:
 *     summary: Update shopping list item
 *     tags: [Shopping List]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Item ID
 *     responses:
 *       200:
 *         description: Item updated
 */
router.put('/:id', updateItem);

/**
 * @swagger
 * /api/shopping-list/{id}:
 *   delete:
 *     summary: Remove item from shopping list
 *     tags: [Shopping List]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Item ID
 *     responses:
 *       200:
 *         description: Item removed
 */
router.delete('/:id', removeItem);

/**
 * @swagger
 * /api/shopping-list/clear/all:
 *   delete:
 *     summary: Clear entire shopping list
 *     tags: [Shopping List]
 *     responses:
 *       200:
 *         description: Shopping list cleared
 */
router.delete('/clear/all', clearList);

/**
 * @swagger
 * /api/shopping-list/clear/purchased:
 *   delete:
 *     summary: Clear purchased items from shopping list
 *     tags: [Shopping List]
 *     responses:
 *       200:
 *         description: Purchased items cleared
 */
router.delete('/clear/purchased', clearPurchased);

export default router;
