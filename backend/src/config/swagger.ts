import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './index';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Recipe Finder API',
      version: '1.0.0',
      description: 'API for Recipe Finder application with nutritional filters and shopping list',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Recipe: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            title: { type: 'string' },
            image: { type: 'string' },
            readyInMinutes: { type: 'number' },
            servings: { type: 'number' },
            summary: { type: 'string' },
            isFavorite: { type: 'boolean' },
          },
        },
        ShoppingListItem: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            amount: { type: 'number' },
            unit: { type: 'string' },
            purchased: { type: 'boolean' },
            recipeId: { type: 'number' },
            recipeName: { type: 'string' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            status: { type: 'number' },
            code: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
