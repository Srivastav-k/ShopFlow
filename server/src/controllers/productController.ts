import type { Request, Response, NextFunction } from "express";
import { productService } from "../services/productService.js";
import {
  formatSuccess,
  formatCreated,
  formatPaginated,
} from "../utils/responseFormatter.js";

export const productController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, category, sort, page, limit } = req.query as Record<
        string,
        string | undefined
      >;
      const result = await productService.getAll({
        search,
        category,
        sort,
        page,
        limit,
      });
      const { statusCode, body } = formatPaginated(
        result.products,
        result.pagination,
      );
      res.setHeader("Cache-Control", "max-age=60");
      res.status(statusCode).json(body);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getById(
        parseInt(req.params.id as string),
      );
      const { statusCode, body } = formatSuccess(product);
      res.status(statusCode).json(body);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.create(req.body);
      const { statusCode, body } = formatCreated(product);
      res.status(statusCode).json(body);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.update(
        parseInt(req.params.id as string),
        req.body,
      );
      const { statusCode, body } = formatSuccess(product);
      res.status(statusCode).json(body);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productService.delete(
        parseInt(req.params.id as string),
      );
      if ("discontinued" in result) {
        res.status(200).json({
          data: { message: "Product discontinued (has order history)" },
        });
      } else {
        res.status(204).send();
      }
    } catch (err) {
      next(err);
    }
  },
};
