import type { Request, Response, NextFunction } from "express";
import { categoryService } from "../services/categoryService.js";
import { formatSuccess, formatCreated } from "../utils/responseFormatter.js";

export const categoryController = {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.getAll();
      const { statusCode, body } = formatSuccess(categories);
      res.status(statusCode).json(body);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.getById(
        parseInt(req.params.id as string),
      );
      const { statusCode, body } = formatSuccess(category);
      res.status(statusCode).json(body);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.create(req.body);
      const { statusCode, body } = formatCreated(category);
      res.status(statusCode).json(body);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.update(
        parseInt(req.params.id as string),
        req.body,
      );
      const { statusCode, body } = formatSuccess(category);
      res.status(statusCode).json(body);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await categoryService.delete(parseInt(req.params.id as string));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
