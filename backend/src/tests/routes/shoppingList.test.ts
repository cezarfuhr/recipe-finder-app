import request from 'supertest';
import app from '../../app';
import shoppingListService from '../../services/shoppingListService';

describe('Shopping List Routes', () => {
  const userId = 'test-user';

  beforeEach(() => {
    shoppingListService.clearList(userId);
  });

  describe('GET /api/shopping-list', () => {
    it('should return empty list initially', async () => {
      const response = await request(app)
        .get('/api/shopping-list')
        .set('x-user-id', userId);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return shopping list items', async () => {
      shoppingListService.addItem(userId, {
        name: 'Tomatoes',
        amount: 2,
        unit: 'kg',
        purchased: false,
      });

      const response = await request(app)
        .get('/api/shopping-list')
        .set('x-user-id', userId);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Tomatoes');
    });
  });

  describe('POST /api/shopping-list', () => {
    it('should add an item to shopping list', async () => {
      const response = await request(app)
        .post('/api/shopping-list')
        .set('x-user-id', userId)
        .send({
          name: 'Milk',
          amount: 1,
          unit: 'L',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Milk');
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/shopping-list')
        .set('x-user-id', userId)
        .send({ name: 'Milk' });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/shopping-list/bulk', () => {
    it('should add multiple items at once', async () => {
      const response = await request(app)
        .post('/api/shopping-list/bulk')
        .set('x-user-id', userId)
        .send({
          items: [
            { name: 'Eggs', amount: 12, unit: 'units', purchased: false },
            { name: 'Butter', amount: 200, unit: 'g', purchased: false },
          ],
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveLength(2);
    });
  });

  describe('PUT /api/shopping-list/:id', () => {
    it('should update an item', async () => {
      const item = shoppingListService.addItem(userId, {
        name: 'Sugar',
        amount: 1,
        unit: 'kg',
        purchased: false,
      });

      const response = await request(app)
        .put(`/api/shopping-list/${item.id}`)
        .set('x-user-id', userId)
        .send({ purchased: true });

      expect(response.status).toBe(200);
      expect(response.body.purchased).toBe(true);
    });

    it('should return 404 for non-existent item', async () => {
      const response = await request(app)
        .put('/api/shopping-list/invalid-id')
        .set('x-user-id', userId)
        .send({ purchased: true });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/shopping-list/:id', () => {
    it('should remove an item', async () => {
      const item = shoppingListService.addItem(userId, {
        name: 'Salt',
        amount: 1,
        unit: 'kg',
        purchased: false,
      });

      const response = await request(app)
        .delete(`/api/shopping-list/${item.id}`)
        .set('x-user-id', userId);

      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /api/shopping-list/clear/all', () => {
    it('should clear entire shopping list', async () => {
      shoppingListService.addItem(userId, {
        name: 'Item',
        amount: 1,
        unit: 'kg',
        purchased: false,
      });

      const response = await request(app)
        .delete('/api/shopping-list/clear/all')
        .set('x-user-id', userId);

      expect(response.status).toBe(200);
      expect(shoppingListService.getShoppingList(userId)).toHaveLength(0);
    });
  });

  describe('DELETE /api/shopping-list/clear/purchased', () => {
    it('should clear only purchased items', async () => {
      shoppingListService.addItem(userId, {
        name: 'Purchased',
        amount: 1,
        unit: 'kg',
        purchased: true,
      });
      shoppingListService.addItem(userId, {
        name: 'Not Purchased',
        amount: 1,
        unit: 'kg',
        purchased: false,
      });

      const response = await request(app)
        .delete('/api/shopping-list/clear/purchased')
        .set('x-user-id', userId);

      expect(response.status).toBe(200);
      expect(shoppingListService.getShoppingList(userId)).toHaveLength(1);
    });
  });
});
