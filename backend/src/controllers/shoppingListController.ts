import { Request, Response, NextFunction } from 'express';
import shoppingListService from '../services/shoppingListService';
import { AppError } from '../middleware/errorHandler';

export const getShoppingList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] as string || 'anonymous';
    const items = shoppingListService.getShoppingList(userId);
    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const addItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] as string || 'anonymous';
    const { name, amount, unit, recipeId, recipeName } = req.body;

    if (!name || !amount || !unit) {
      throw new AppError('Name, amount, and unit are required', 400, 'INVALID_REQUEST');
    }

    const item = shoppingListService.addItem(userId, {
      name,
      amount,
      unit,
      purchased: false,
      recipeId,
      recipeName,
    });

    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

export const addItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] as string || 'anonymous';
    const { items } = req.body;

    if (!Array.isArray(items)) {
      throw new AppError('Items must be an array', 400, 'INVALID_REQUEST');
    }

    const addedItems = shoppingListService.addItems(userId, items);
    res.status(201).json(addedItems);
  } catch (error) {
    next(error);
  }
};

export const updateItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] as string || 'anonymous';
    const itemId = req.params.id;
    const updates = req.body;

    const updatedItem = shoppingListService.updateItem(userId, itemId, updates);

    if (!updatedItem) {
      throw new AppError('Item not found', 404, 'NOT_FOUND');
    }

    res.json(updatedItem);
  } catch (error) {
    next(error);
  }
};

export const removeItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] as string || 'anonymous';
    const itemId = req.params.id;

    const removed = shoppingListService.removeItem(userId, itemId);

    if (!removed) {
      throw new AppError('Item not found', 404, 'NOT_FOUND');
    }

    res.json({ message: 'Item removed', itemId });
  } catch (error) {
    next(error);
  }
};

export const clearList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] as string || 'anonymous';
    shoppingListService.clearList(userId);
    res.json({ message: 'Shopping list cleared' });
  } catch (error) {
    next(error);
  }
};

export const clearPurchased = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] as string || 'anonymous';
    shoppingListService.clearPurchased(userId);
    res.json({ message: 'Purchased items cleared' });
  } catch (error) {
    next(error);
  }
};
