import shoppingListService from '../../services/shoppingListService';

describe('ShoppingListService', () => {
  const userId = 'test-user';

  beforeEach(() => {
    shoppingListService.clearList(userId);
  });

  describe('addItem', () => {
    it('should add an item to the shopping list', () => {
      const item = shoppingListService.addItem(userId, {
        name: 'Tomatoes',
        amount: 2,
        unit: 'kg',
        purchased: false,
      });

      expect(item).toHaveProperty('id');
      expect(item.name).toBe('Tomatoes');
      expect(item.amount).toBe(2);
      expect(item.unit).toBe('kg');
    });

    it('should add item with recipe information', () => {
      const item = shoppingListService.addItem(userId, {
        name: 'Pasta',
        amount: 500,
        unit: 'g',
        purchased: false,
        recipeId: 123,
        recipeName: 'Spaghetti Carbonara',
      });

      expect(item.recipeId).toBe(123);
      expect(item.recipeName).toBe('Spaghetti Carbonara');
    });
  });

  describe('addItems', () => {
    it('should add multiple items at once', () => {
      const items = shoppingListService.addItems(userId, [
        { name: 'Milk', amount: 1, unit: 'L', purchased: false },
        { name: 'Eggs', amount: 12, unit: 'units', purchased: false },
      ]);

      expect(items).toHaveLength(2);
      expect(shoppingListService.getShoppingList(userId)).toHaveLength(2);
    });
  });

  describe('updateItem', () => {
    it('should update an item', () => {
      const item = shoppingListService.addItem(userId, {
        name: 'Butter',
        amount: 200,
        unit: 'g',
        purchased: false,
      });

      const updated = shoppingListService.updateItem(userId, item.id, {
        purchased: true,
      });

      expect(updated?.purchased).toBe(true);
    });

    it('should return null for non-existent item', () => {
      const updated = shoppingListService.updateItem(userId, 'invalid-id', {
        purchased: true,
      });

      expect(updated).toBeNull();
    });
  });

  describe('removeItem', () => {
    it('should remove an item from the list', () => {
      const item = shoppingListService.addItem(userId, {
        name: 'Sugar',
        amount: 1,
        unit: 'kg',
        purchased: false,
      });

      const removed = shoppingListService.removeItem(userId, item.id);

      expect(removed).toBe(true);
      expect(shoppingListService.getShoppingList(userId)).toHaveLength(0);
    });

    it('should return false for non-existent item', () => {
      const removed = shoppingListService.removeItem(userId, 'invalid-id');

      expect(removed).toBe(false);
    });
  });

  describe('clearPurchased', () => {
    it('should remove only purchased items', () => {
      shoppingListService.addItem(userId, {
        name: 'Item 1',
        amount: 1,
        unit: 'kg',
        purchased: true,
      });

      const unpurchased = shoppingListService.addItem(userId, {
        name: 'Item 2',
        amount: 1,
        unit: 'kg',
        purchased: false,
      });

      shoppingListService.clearPurchased(userId);
      const list = shoppingListService.getShoppingList(userId);

      expect(list).toHaveLength(1);
      expect(list[0].id).toBe(unpurchased.id);
    });
  });

  describe('clearList', () => {
    it('should clear all items', () => {
      shoppingListService.addItems(userId, [
        { name: 'Item 1', amount: 1, unit: 'kg', purchased: false },
        { name: 'Item 2', amount: 1, unit: 'kg', purchased: false },
      ]);

      shoppingListService.clearList(userId);

      expect(shoppingListService.getShoppingList(userId)).toHaveLength(0);
    });
  });
});
