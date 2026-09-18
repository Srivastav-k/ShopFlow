import type { Request, Response, NextFunction } from "express";
import { orderService } from "../services/orderService.js";
import { formatSuccess, formatCreated } from "../utils/responseFormatter.js";

export const orderController = {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await orderService.getAll();
      const { statusCode, body } = formatSuccess(orders);
      res.status(statusCode).json(body);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await orderService.getById(parseInt(req.params.id as string));
      const { statusCode, body } = formatSuccess(order);
      res.status(statusCode).json(body);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await orderService.create(req.body);
      const { statusCode, body } = formatCreated(order);
      res.status(statusCode).json(body);
    } catch (err) {
      next(err);
    }
  },
};
