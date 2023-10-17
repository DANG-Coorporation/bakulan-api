import { Router } from "express";
import {
  resetPasswordValidator,
  sendResetPasswordEmailValidator,
} from "../helper/validator/reset_password.validator";
import { ResetPasswordController } from "../controllers/reset-password";

export default class ResetPasswordRouter {
  router: Router;
  resetPasswordController: ResetPasswordController;

  constructor() {
    // Initialize controllers objects
    this.resetPasswordController = new ResetPasswordController();

    // Initialize router object
    this.router = Router({ mergeParams: true });
    this.resetRouter();
  }

  private resetRouter() {
    this.router.post(
      "/send-reset-password-email",
      sendResetPasswordEmailValidator(),
      (req, res) =>
        this.resetPasswordController.sendResetPasswordEmail(req, res)
    );

    this.router.get("/check-token/:token", (req, res) =>
      this.resetPasswordController.checkToken(req, res)
    );

    this.router.post(
      "/reset-password/:token",
      resetPasswordValidator(),
      (req, res) => this.resetPasswordController.resetPassword(req, res)
    );
  }
}
