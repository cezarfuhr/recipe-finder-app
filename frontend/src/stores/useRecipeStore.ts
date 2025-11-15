import { create } from 'zustand';
import { Recipe, SearchFilters, ShoppingListItem } from '../types';
import * as api from '../services/api';

interface RecipeStore {
  recipes: Recipe[];
  selectedRecipe: Recipe | null;
  favorites: Recipe[];
  shoppingList: ShoppingListItem[];
  loading: boolean;
  error: string | null;
  totalResults: number;

  // Recipe actions
  searchRecipes: (filters: SearchFilters) => Promise<void>;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  getRecipeById: (id: number) => Promise<void>;
  getRandomRecipes: () => Promise<void>;

  // Favorite actions
  loadFavorites: () => Promise<void>;
  toggleFavorite: (recipe: Recipe) => Promise<void>;
  clearFavorites: () => Promise<void>;

  // Shopping list actions
  loadShoppingList: () => Promise<void>;
  addToShoppingList: (item: Omit<ShoppingListItem, 'id'>) => Promise<void>;
  addIngredientsToShoppingList: (recipe: Recipe) => Promise<void>;
  updateShoppingListItem: (id: string, updates: Partial<ShoppingListItem>) => Promise<void>;
  removeFromShoppingList: (id: string) => Promise<void>;
  clearShoppingList: () => Promise<void>;
  clearPurchasedItems: () => Promise<void>;
}

export const useRecipeStore = create<RecipeStore>((set, get) => ({
  recipes: [],
  selectedRecipe: null,
  favorites: [],
  shoppingList: [],
  loading: false,
  error: null,
  totalResults: 0,

  // Recipe actions
  searchRecipes: async (filters: SearchFilters) => {
    set({ loading: true, error: null });
    try {
      const result = await api.searchRecipes(filters);
      set({ recipes: result.results, totalResults: result.totalResults, loading: false });
    } catch (error) {
      set({ error: 'Failed to search recipes', loading: false });
      console.error('Search error:', error);
    }
  },

  setSelectedRecipe: (recipe: Recipe | null) => {
    set({ selectedRecipe: recipe });
  },

  getRecipeById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const recipe = await api.getRecipeById(id);
      set({ selectedRecipe: recipe, loading: false });
    } catch (error) {
      set({ error: 'Failed to get recipe', loading: false });
      console.error('Get recipe error:', error);
    }
  },

  getRandomRecipes: async () => {
    set({ loading: true, error: null });
    try {
      const recipes = await api.getRandomRecipes(12);
      set({ recipes, totalResults: recipes.length, loading: false });
    } catch (error) {
      set({ error: 'Failed to get random recipes', loading: false });
      console.error('Random recipes error:', error);
    }
  },

  // Favorite actions
  loadFavorites: async () => {
    set({ loading: true, error: null });
    try {
      const favorites = await api.getFavorites();
      set({ favorites, loading: false });
    } catch (error) {
      set({ error: 'Failed to load favorites', loading: false });
      console.error('Load favorites error:', error);
    }
  },

  toggleFavorite: async (recipe: Recipe) => {
    try {
      if (recipe.isFavorite) {
        await api.removeFavorite(recipe.id);
      } else {
        await api.addFavorite(recipe.id);
      }

      // Update local state
      const updatedRecipes = get().recipes.map(r =>
        r.id === recipe.id ? { ...r, isFavorite: !r.isFavorite } : r
      );
      set({ recipes: updatedRecipes });

      // Reload favorites
      await get().loadFavorites();
    } catch (error) {
      set({ error: 'Failed to toggle favorite' });
      console.error('Toggle favorite error:', error);
    }
  },

  clearFavorites: async () => {
    try {
      await api.clearFavorites();
      set({ favorites: [] });
    } catch (error) {
      set({ error: 'Failed to clear favorites' });
      console.error('Clear favorites error:', error);
    }
  },

  // Shopping list actions
  loadShoppingList: async () => {
    try {
      const shoppingList = await api.getShoppingList();
      set({ shoppingList });
    } catch (error) {
      set({ error: 'Failed to load shopping list' });
      console.error('Load shopping list error:', error);
    }
  },

  addToShoppingList: async (item: Omit<ShoppingListItem, 'id'>) => {
    try {
      await api.addShoppingListItem(item);
      await get().loadShoppingList();
    } catch (error) {
      set({ error: 'Failed to add item to shopping list' });
      console.error('Add to shopping list error:', error);
    }
  },

  addIngredientsToShoppingList: async (recipe: Recipe) => {
    try {
      if (!recipe.extendedIngredients || recipe.extendedIngredients.length === 0) {
        return;
      }

      const items = recipe.extendedIngredients.map(ingredient => ({
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        purchased: false,
        recipeId: recipe.id,
        recipeName: recipe.title,
      }));

      await api.addShoppingListItems(items);
      await get().loadShoppingList();
    } catch (error) {
      set({ error: 'Failed to add ingredients to shopping list' });
      console.error('Add ingredients error:', error);
    }
  },

  updateShoppingListItem: async (id: string, updates: Partial<ShoppingListItem>) => {
    try {
      await api.updateShoppingListItem(id, updates);
      await get().loadShoppingList();
    } catch (error) {
      set({ error: 'Failed to update item' });
      console.error('Update item error:', error);
    }
  },

  removeFromShoppingList: async (id: string) => {
    try {
      await api.removeShoppingListItem(id);
      await get().loadShoppingList();
    } catch (error) {
      set({ error: 'Failed to remove item' });
      console.error('Remove item error:', error);
    }
  },

  clearShoppingList: async () => {
    try {
      await api.clearShoppingList();
      set({ shoppingList: [] });
    } catch (error) {
      set({ error: 'Failed to clear shopping list' });
      console.error('Clear shopping list error:', error);
    }
  },

  clearPurchasedItems: async () => {
    try {
      await api.clearPurchasedItems();
      await get().loadShoppingList();
    } catch (error) {
      set({ error: 'Failed to clear purchased items' });
      console.error('Clear purchased error:', error);
    }
  },
}));
