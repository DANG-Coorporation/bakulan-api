/// <reference path="../controllers/custom.d.ts" />

import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../helper/Error/UnauthorizedException/UnauthorizedException";
import { ProcessError } from "../helper/Error/errorHandler";
import { IUser } from "../helper/interface/auth/login";
import JwtService from "../service/jwt.service";
// import JwtService from "../service/jwt.service";
// import Users from "../database/models/user";

export default class AuthMiddleware {
  public async checkAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const bypasAuth = ["/api/auth"];
      for (let whitelist of bypasAuth) {
        if (req.path.startsWith(whitelist)) {
          return next();
        }
      }

      if (!req.headers.authorization)
        throw new UnauthorizedException("Unauthorized", {});
      const jwtService = new JwtService();

      const token = req.headers.authorization.split(" ")[1];
      const decoded = await jwtService.verifyToken(token);
      req.user = decoded as IUser;
      next();
    } catch (error) {
      ProcessError(error, res);
    }
  }
}
