import { Recipe } from '../types';

// In-memory storage (in production, use a database)
class FavoritesService {
  private favorites: Map<string, Set<number>> = new Map();

  addFavorite(userId: string, recipeId: number): void {
    if (!this.favorites.has(userId)) {
      this.favorites.set(userId, new Set());
    }
    this.favorites.get(userId)!.add(recipeId);
  }

  removeFavorite(userId: string, recipeId: number): boolean {
    const userFavorites = this.favorites.get(userId);
    if (!userFavorites) {
      return false;
    }
    return userFavorites.delete(recipeId);
  }

  getFavorites(userId: string): number[] {
    const userFavorites = this.favorites.get(userId);
    return userFavorites ? Array.from(userFavorites) : [];
  }

  isFavorite(userId: string, recipeId: number): boolean {
    const userFavorites = this.favorites.get(userId);
    return userFavorites ? userFavorites.has(recipeId) : false;
  }

  clearFavorites(userId: string): void {
    this.favorites.delete(userId);
  }

  // Mark recipes as favorites based on user
  markRecipesAsFavorites(userId: string, recipes: Recipe[]): Recipe[] {
    return recipes.map(recipe => ({
      ...recipe,
      isFavorite: this.isFavorite(userId, recipe.id),
    }));
  }
}

export default new FavoritesService();
