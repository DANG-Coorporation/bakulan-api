import { Request, Response } from "express";
import { ResetPasswordService } from "../service/reset_password.service";
import { ProcessError } from "../helper/Error/errorHandler";
import { HttpStatusCode } from "axios";
import message from "../config/message";

export class ResetPasswordController {
  resetPasswordService: ResetPasswordService;

  constructor() {
    this.resetPasswordService = new ResetPasswordService();
  }

  async sendResetPasswordEmail(req: Request, res: Response) {
    try {
      const email = req.body.email;
      const result = await this.resetPasswordService.generateToken(email);
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: message.success,
        data: result,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async checkToken(req: Request, res: Response) {
    try {
      const token = req.params.token;
      const result = await this.resetPasswordService.checkToken(token);
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: message.success,
        data: result,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const token = req.params.token;
      const password = req.body.password;
      const result = await this.resetPasswordService.resetPassword(
        token,
        password
      );
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
