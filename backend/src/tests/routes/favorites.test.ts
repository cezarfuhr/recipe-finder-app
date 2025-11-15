import request from 'supertest';
import app from '../../app';
import favoritesService from '../../services/favoritesService';

describe('Favorites Routes', () => {
  const userId = 'test-user';

  beforeEach(() => {
    favoritesService.clearFavorites(userId);
  });

  describe('POST /api/favorites', () => {
    it('should add a recipe to favorites', async () => {
      const response = await request(app)
        .post('/api/favorites')
        .set('x-user-id', userId)
        .send({ recipeId: 123 });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message');
      expect(response.body.recipeId).toBe(123);
    });

    it('should return 400 if recipeId is missing', async () => {
      const response = await request(app)
        .post('/api/favorites')
        .set('x-user-id', userId)
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/favorites/:id', () => {
    it('should remove a recipe from favorites', async () => {
      favoritesService.addFavorite(userId, 123);

      const response = await request(app)
        .delete('/api/favorites/123')
        .set('x-user-id', userId);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 if recipe not in favorites', async () => {
      const response = await request(app)
        .delete('/api/favorites/999')
        .set('x-user-id', userId);

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/favorites/clear/all', () => {
    it('should clear all favorites', async () => {
      favoritesService.addFavorite(userId, 123);
      favoritesService.addFavorite(userId, 456);

      const response = await request(app)
        .delete('/api/favorites/clear/all')
        .set('x-user-id', userId);

      expect(response.status).toBe(200);
      expect(favoritesService.getFavorites(userId)).toHaveLength(0);
    });
  });
});
