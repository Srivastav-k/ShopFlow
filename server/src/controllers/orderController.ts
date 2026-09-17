import type { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/orderService.js';
import { formatSuccess, formatCreated } from '../utils/responseFormatter.js';

export const orderController = {
  getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const orders = orderService.getAll();
      const { statusCode, body } = formatSuccess(orders);
      res.status(statusCode).json(body);
    } catch (err) { next(err); }
  },

  getById(req: Request, res: Response, next: NextFunction) {
    try {
      const order = orderService.getById(parseInt(req.params.id));
      const { statusCode, body } = formatSuccess(order);
      res.status(statusCode).json(body);
    } catch (err) { next(err); }
  },

  create(req: Request, res: Response, next: NextFunction) {
    try {
      const order = orderService.create(req.body);
      const { statusCode, body } = formatCreated(order);
      res.status(statusCode).json(body);
    } catch (err) { next(err); }
  },
};
