import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ResponseUtil } from "../../utils/Response";
import { AppDataSource } from "./../../database/data-source";
import { User } from "./../../database/entities/User";

export class AuthMiddleware {
  static async authenticate(req: Request, res: Response, next: NextFunction) {
    const { authorization: tokenHeader } = req.headers;
    if (!tokenHeader) {
      return ResponseUtil.sendError(res, "Token not provided", 401, null);
    }
    const token = tokenHeader.split(" ")[1];
    try {
      const decoded: any = await jwt.verify(token, process.env.ACCESS_KEY_SECRET || "secret123");
      // @ts-ignore
      const id = decoded.user.id
      const repo = AppDataSource.getRepository(User);
      const user = await repo.findOneByOrFail({ id });
      // @ts-ignore
      req.user = user;
    } catch (error) {
      console.error(error);
      return ResponseUtil.sendError(res, "Invalid token", 401, null);
    }
    next();
  }
  static authorize(action: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
      let permissions = []
      // @ts-ignore
      const user = req.user as User;
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized - Permission not allowed' });
      }
      const repo = AppDataSource.getRepository(User);
      const fetchData = await repo.query(`SELECT DISTINCT permissions.name FROM users INNER JOIN user_role ON users.id = user_role.usersId INNER JOIN roles ON user_role.rolesId = roles.id INNER JOIN role_permission ON roles.id = role_permission.rolesId INNER JOIN permissions on role_permission.permissionsId = permissions.id WHERE users.id = ${user.id}`)
      for (let ob of fetchData) {
        //@ts-ignore
        permissions.push(ob.name)
      }
      //@ts-ignore
      req.permissions = permissions;
      //@ts-ignore
      if (permissions.includes(action))
        next()
      else return res.status(401).json({ message: 'Permission not allowed' });
    }
  }
}
