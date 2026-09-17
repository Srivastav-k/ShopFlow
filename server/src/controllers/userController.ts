import type { Request, Response, NextFunction } from 'express';
import { userService } from '../services/userService.js';
import { formatSuccess } from '../utils/responseFormatter.js';

export const userController = {
  getProfile(_req: Request, res: Response, next: NextFunction) {
    try {
      const user = userService.getProfile();
      const { statusCode, body } = formatSuccess(user);
      res.status(statusCode).json(body);
    } catch (err) { next(err); }
  },

  updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = userService.updateProfile(req.body);
      const { statusCode, body } = formatSuccess(user);
      res.status(statusCode).json(body);
    } catch (err) { next(err); }
  },
};
