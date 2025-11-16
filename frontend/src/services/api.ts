import axios from 'axios';
import { Recipe, SearchFilters, SearchResult, ShoppingListItem } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// User ID for demo purposes (in production, use authentication)
const USER_ID = 'demo-user';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': USER_ID,
  },
});

// Recipes
export const searchRecipes = async (filters: SearchFilters): Promise<SearchResult> => {
  const { data } = await api.get('/recipes/search', { params: filters });
  return data;
};

export const getRecipeById = async (id: number): Promise<Recipe> => {
  const { data } = await api.get(`/recipes/${id}`);
  return data;
};

export const getRecipesByIngredients = async (ingredients: string[]): Promise<Recipe[]> => {
  const { data } = await api.get('/recipes/by-ingredients', {
    params: { ingredients: ingredients.join(',') },
  });
  return data;
};

export const getRandomRecipes = async (number = 10): Promise<Recipe[]> => {
  const { data } = await api.get('/recipes/random', { params: { number } });
  return data;
};

export const getSimilarRecipes = async (id: number, limit = 3): Promise<Recipe[]> => {
  const { data } = await api.get(`/recipes/${id}/similar`, { params: { limit } });
  return data;
};

// Favorites
export const getFavorites = async (): Promise<Recipe[]> => {
  const { data } = await api.get('/favorites');
  return data;
};

export const addFavorite = async (recipeId: number): Promise<void> => {
  await api.post('/favorites', { recipeId });
};

export const removeFavorite = async (recipeId: number): Promise<void> => {
  await api.delete(`/favorites/${recipeId}`);
};

export const clearFavorites = async (): Promise<void> => {
  await api.delete('/favorites/clear/all');
};

// Shopping List
export const getShoppingList = async (): Promise<ShoppingListItem[]> => {
  const { data } = await api.get('/shopping-list');
  return data;
};

export const addShoppingListItem = async (
  item: Omit<ShoppingListItem, 'id'>
): Promise<ShoppingListItem> => {
  const { data } = await api.post('/shopping-list', item);
  return data;
};

export const addShoppingListItems = async (
  items: Omit<ShoppingListItem, 'id'>[]
): Promise<ShoppingListItem[]> => {
  const { data } = await api.post('/shopping-list/bulk', { items });
  return data;
};

export const updateShoppingListItem = async (
  id: string,
  updates: Partial<ShoppingListItem>
): Promise<ShoppingListItem> => {
  const { data } = await api.put(`/shopping-list/${id}`, updates);
  return data;
};

export const removeShoppingListItem = async (id: string): Promise<void> => {
  await api.delete(`/shopping-list/${id}`);
};

export const clearShoppingList = async (): Promise<void> => {
  await api.delete('/shopping-list/clear/all');
};

export const clearPurchasedItems = async (): Promise<void> => {
  await api.delete('/shopping-list/clear/purchased');
};
