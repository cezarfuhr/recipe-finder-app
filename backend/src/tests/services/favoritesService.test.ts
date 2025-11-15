import favoritesService from '../../services/favoritesService';

describe('FavoritesService', () => {
  const userId = 'test-user';
  const recipeId = 123;

  beforeEach(() => {
    favoritesService.clearFavorites(userId);
  });

  describe('addFavorite', () => {
    it('should add a recipe to favorites', () => {
      favoritesService.addFavorite(userId, recipeId);
      const favorites = favoritesService.getFavorites(userId);

      expect(favorites).toContain(recipeId);
    });

    it('should not add duplicate favorites', () => {
      favoritesService.addFavorite(userId, recipeId);
      favoritesService.addFavorite(userId, recipeId);
      const favorites = favoritesService.getFavorites(userId);

      expect(favorites.length).toBe(1);
    });
  });

  describe('removeFavorite', () => {
    it('should remove a recipe from favorites', () => {
      favoritesService.addFavorite(userId, recipeId);
      const removed = favoritesService.removeFavorite(userId, recipeId);

      expect(removed).toBe(true);
      expect(favoritesService.getFavorites(userId)).toHaveLength(0);
    });

    it('should return false when removing non-existent favorite', () => {
      const removed = favoritesService.removeFavorite(userId, 999);

      expect(removed).toBe(false);
    });
  });

  describe('isFavorite', () => {
    it('should return true for favorited recipe', () => {
      favoritesService.addFavorite(userId, recipeId);

      expect(favoritesService.isFavorite(userId, recipeId)).toBe(true);
    });

    it('should return false for non-favorited recipe', () => {
      expect(favoritesService.isFavorite(userId, recipeId)).toBe(false);
    });
  });

  describe('clearFavorites', () => {
    it('should clear all favorites for a user', () => {
      favoritesService.addFavorite(userId, recipeId);
      favoritesService.addFavorite(userId, 456);
      favoritesService.clearFavorites(userId);

      expect(favoritesService.getFavorites(userId)).toHaveLength(0);
    });
  });

  describe('markRecipesAsFavorites', () => {
    it('should mark recipes as favorites', () => {
      const recipes = [
        { id: recipeId, title: 'Test Recipe', image: '', isFavorite: false },
        { id: 456, title: 'Test Recipe 2', image: '', isFavorite: false },
      ];

      favoritesService.addFavorite(userId, recipeId);
      const marked = favoritesService.markRecipesAsFavorites(userId, recipes);

      expect(marked[0].isFavorite).toBe(true);
      expect(marked[1].isFavorite).toBe(false);
    });
  });
});
