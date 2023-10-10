/// <reference path="./custom.d.ts" />
import { HttpStatusCode } from "axios";
import { Request, Response } from "express";
import message from "../config/message";
import { ProcessError } from "../helper/Error/errorHandler";
import { IAdmin } from "../helper/interface/user/create.admin.interface";
import UserService from "../service/user.service";
import { ILoginRequest } from "../helper/interface/auth/login";

export class UserController {
  userServices: UserService;

  constructor() {
    this.userServices = new UserService();
  }

  async createOwner(req: Request, res: Response) {
    try {
      const body = req.body as IAdmin;
      const result = await this.userServices.createAdmin(body);
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: message.success,
        data: result,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const body = req.body as ILoginRequest;
      const result = await this.userServices.login(body);
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: message.success,
        data: result,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      const result = await this.userServices.getRefreshToken(refreshToken);
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: message.success,
        data: result,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }
}
