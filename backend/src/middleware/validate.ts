import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from './errorHandler';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      next(new AppError(errorMessage, 400, 'VALIDATION_ERROR'));
      return;
    }

    req.body = value;
    next();
  };
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      next(new AppError(errorMessage, 400, 'VALIDATION_ERROR'));
      return;
    }

    req.query = value;
    next();
  };
};

// Common validation schemas
export const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().optional(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  addFavorite: Joi.object({
    recipeId: Joi.number().required(),
  }),

  addShoppingListItem: Joi.object({
    name: Joi.string().required(),
    amount: Joi.number().positive().required(),
    unit: Joi.string().required(),
    recipeId: Joi.number().optional(),
    recipeName: Joi.string().optional(),
  }),

  updateShoppingListItem: Joi.object({
    name: Joi.string().optional(),
    amount: Joi.number().positive().optional(),
    unit: Joi.string().optional(),
    purchased: Joi.boolean().optional(),
  }),
};
