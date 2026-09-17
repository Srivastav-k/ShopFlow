import type { Request, Response, NextFunction } from 'express';
import { productService } from '../services/productService.js';
import { formatSuccess, formatCreated, formatPaginated } from '../utils/responseFormatter.js';

export const productController = {
  getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, category, sort, page, limit } = req.query as Record<string, string | undefined>;
      const result = productService.getAll({ search, category, sort, page, limit });
      const { statusCode, body } = formatPaginated(result.products, result.pagination);
      res.status(statusCode).json(body);
    } catch (err) { next(err); }
  },

  getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = productService.getById(parseInt(req.params.id));
      const { statusCode, body } = formatSuccess(product);
      res.status(statusCode).json(body);
    } catch (err) { next(err); }
  },

  create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = productService.create(req.body);
      const { statusCode, body } = formatCreated(product);
      res.status(statusCode).json(body);
    } catch (err) { next(err); }
  },

  update(req: Request, res: Response, next: NextFunction) {
    try {
      const product = productService.update(parseInt(req.params.id), req.body);
      const { statusCode, body } = formatSuccess(product);
      res.status(statusCode).json(body);
    } catch (err) { next(err); }
  },

  delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = productService.delete(parseInt(req.params.id));
      if ('discontinued' in result) {
        res.status(200).json({ data: { message: 'Product discontinued (has order history)' } });
      } else {
        res.status(204).send();
      }
    } catch (err) { next(err); }
  },
};
