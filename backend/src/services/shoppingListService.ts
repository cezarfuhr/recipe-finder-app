import { ShoppingListItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage (in production, use a database)
class ShoppingListService {
  private shoppingLists: Map<string, ShoppingListItem[]> = new Map();

  getShoppingList(userId: string): ShoppingListItem[] {
    return this.shoppingLists.get(userId) || [];
  }

  addItem(userId: string, item: Omit<ShoppingListItem, 'id'>): ShoppingListItem {
    if (!this.shoppingLists.has(userId)) {
      this.shoppingLists.set(userId, []);
    }

    const newItem: ShoppingListItem = {
      ...item,
      id: uuidv4(),
    };

    this.shoppingLists.get(userId)!.push(newItem);
    return newItem;
  }

  addItems(userId: string, items: Omit<ShoppingListItem, 'id'>[]): ShoppingListItem[] {
    return items.map(item => this.addItem(userId, item));
  }

  updateItem(userId: string, itemId: string, updates: Partial<ShoppingListItem>): ShoppingListItem | null {
    const list = this.shoppingLists.get(userId);
    if (!list) {
      return null;
    }

    const itemIndex = list.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      return null;
    }

    list[itemIndex] = { ...list[itemIndex], ...updates };
    return list[itemIndex];
  }

  removeItem(userId: string, itemId: string): boolean {
    const list = this.shoppingLists.get(userId);
    if (!list) {
      return false;
    }

    const initialLength = list.length;
    const filtered = list.filter(item => item.id !== itemId);

    if (filtered.length === initialLength) {
      return false;
    }

    this.shoppingLists.set(userId, filtered);
    return true;
  }

  clearList(userId: string): void {
    this.shoppingLists.delete(userId);
  }

  clearPurchased(userId: string): void {
    const list = this.shoppingLists.get(userId);
    if (list) {
      const unpurchased = list.filter(item => !item.purchased);
      this.shoppingLists.set(userId, unpurchased);
    }
  }
}

export default new ShoppingListService();
