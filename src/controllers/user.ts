/// <reference path="./custom.d.ts" />
import { HttpStatusCode } from "axios";
import { Request, Response } from "express";
import message from "../config/message";
import { ProcessError } from "../helper/Error/errorHandler";
import {
  IAdmin,
  ICreateCashier,
} from "../helper/interface/user/create.admin.interface";
import UserService from "../service/user.service";
import { ILoginRequest, IUser } from "../helper/interface/auth/login";
import { ForbiddenException } from "../helper/Error/Forbidden/ForbiddenException";

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

  async createCashier(req: Request, res: Response) {
    try {
      const body = req.body as ICreateCashier;
      const user = req.user;
      if (!user.isAdmin) throw new ForbiddenException("You are not admin", {});
      const result = await this.userServices.createCashier(body, user.id);
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: message.success,
        data: result,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async deleteCashier(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const user = req.user;
      if (!user.isAdmin) throw new ForbiddenException("You are not admin", {});
      const result = await this.userServices.deleteCashier(id, user.id);
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: message.success,
        data: result,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async updateCashier(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const body = req.body as IUser;
      const user = req.user;
      if (!user.isAdmin) throw new ForbiddenException("You are not admin", {});
      const result = await this.userServices.updateCashier(id, body, user.id);
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: message.success,
        data: result,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async addMerchant(req: Request, res: Response) {
    try {
      const body = req.body;
      const user = req.user;
      if (!user.isAdmin) throw new ForbiddenException("You are not admin", {});
      const result = await this.userServices.addMerchant(body.name, user.id);
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

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const user = await this.userServices.updatePicture(userId, req.file!);
      res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: message.success,
        data: user,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }
}
