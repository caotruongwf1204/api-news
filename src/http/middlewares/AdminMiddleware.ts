import { NextFunction, Request, Response } from "express";
import { User } from "../../database/entities/User";
export class AdminMiddleware {
  static async check(req: Request, res: Response, next: NextFunction) {
    // @ts-ignore
    const user = req.user as User;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized - Admin access required' });
    }
    // Kiểm tra xem người dùng có vai trò admin không
    const isAdmin = user.roles.some(role => role.name === 'Admin');
    if (!isAdmin) {
      return res.status(403).json({ message: 'Forbidden - Admin access required' });
    }
    next();
  }
}