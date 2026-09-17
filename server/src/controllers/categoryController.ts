import type { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/categoryService.js';
import { formatSuccess, formatCreated } from '../utils/responseFormatter.js';

export const categoryController = {
  getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = categoryService.getAll();
      const { statusCode, body } = formatSuccess(categories);
      res.status(statusCode).json(body);
    } catch (err) { next(err); }
  },

  getById(req: Request, res: Response, next: NextFunction) {
    try {
      const category = categoryService.getById(parseInt(req.params.id));
      const { statusCode, body } = formatSuccess(category);
      res.status(statusCode).json(body);
    } catch (err) { next(err); }
  },

  create(req: Request, res: Response, next: NextFunction) {
    try {
      const category = categoryService.create(req.body);
      const { statusCode, body } = formatCreated(category);
      res.status(statusCode).json(body);
    } catch (err) { next(err); }
  },

  update(req: Request, res: Response, next: NextFunction) {
    try {
      const category = categoryService.update(parseInt(req.params.id), req.body);
      const { statusCode, body } = formatSuccess(category);
      res.status(statusCode).json(body);
    } catch (err) { next(err); }
  },

  delete(req: Request, res: Response, next: NextFunction) {
    try {
      categoryService.delete(parseInt(req.params.id));
      res.status(204).send();
    } catch (err) { next(err); }
  },
};
