import type { Request, Response, NextFunction } from "express";
import { userService } from "../services/userService.js";
import { formatSuccess } from "../utils/responseFormatter.js";

export const userController = {
  async getProfile(_req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.getProfile();
      const { statusCode, body } = formatSuccess(user);
      res.setHeader("Cache-Control", "max-age=60");
      res.status(statusCode).json(body);
    } catch (err) {
      next(err);
    }
  },

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.updateProfile(req.body);
      const { statusCode, body } = formatSuccess(user);
      res.status(statusCode).json(body);
    } catch (err) {
      next(err);
    }
  },
};
