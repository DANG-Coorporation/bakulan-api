import configConstants from "../config/constants";
import TokenResetPassword from "../database/models/token_reset_password";
import Users from "../database/models/user";
import { NotFoundException } from "../helper/Error/NotFound/NotFoundException";
import { ProcessError } from "../helper/Error/errorHandler";
import { NodemailerService } from "./nodemailer.service";
import generateUniqueId from "generate-unique-id";
import bcrypt from "bcrypt";

export class ResetPasswordService {
  emailService: NodemailerService;

  constructor() {
    this.emailService = new NodemailerService();
  }

  async sendResetPasswordEmail(to: string, token: string) {
    const subject = "Reset Password";
    const text = `Please click the link below to reset your password:
    ${configConstants.RESET_PASSWORD_WEB_URL}/${token}`;
    return this.emailService.sendMail(to, subject, text);
  }

  async sendResetPasswordSuccessEmail(to: string) {
    const subject = "Reset Password Success";
    const text = `Your password has been reset successfully.`;
    return this.emailService.sendMail(to, subject, text);
  }

  async sendResetPasswordFailedEmail(to: string) {
    const subject = "Reset Password Failed";
    const text = `Your password has not been reset.`;
    return this.emailService.sendMail(to, subject, text);
  }

  async sendResetPasswordExpiredEmail(to: string) {
    const subject = "Reset Password Expired";
    const text = `Your reset password link has expired.`;
    return this.emailService.sendMail(to, subject, text);
  }

  async generateToken(email: string) {
    try {
      const user = await Users.findOne({
        where: { email: email },
        attributes: ["id", "email", "password"],
      });
      if (!user) {
        throw new NotFoundException("Email not found!", {});
      }
      const token = generateUniqueId({
        length: 50,
        useLetters: true,
        useNumbers: true,
      });

      const tokenResetPassword = await TokenResetPassword.create({
        token: token,
        userId: user.id,
        used: false,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      await this.sendResetPasswordEmail(email, token);
      return tokenResetPassword;
    } catch (error) {
      throw error;
    }
  }

  async checkToken(token: string) {
    try {
      const tokenResetPassword = await this.findToken(token);

      const user = await Users.findOne({
        where: { id: tokenResetPassword.userId },
        attributes: ["id", "email", "username"],
      });
      if (!user) {
        throw new NotFoundException("User not found!", {});
      }
      return { tokenResetPassword, user };
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(token: string, password: string) {
    try {
      const tokenResetPassword = await this.findToken(token);
      const user = await Users.findOne({
        where: { id: tokenResetPassword.userId },
      });
      if (!user) {
        throw new NotFoundException("User not found!", {});
      }
      if (await bcrypt.compare(password, user.password)) {
        throw new NotFoundException(
          "New password must be different from the old password!",
          {}
        );
      }
      const hashPassword = await bcrypt.hash(password, 10);
      await user.update({ password: hashPassword });
      await tokenResetPassword.update({ used: true });
      await this.sendResetPasswordSuccessEmail(user.email);
      return { tokenResetPassword, user };
    } catch (error) {
      throw error;
    }
  }

  async findToken(token: string) {
    try {
      const tokenResetPassword = await TokenResetPassword.findOne({
        where: { token: token },
      });
      if (!tokenResetPassword) {
        throw new NotFoundException("Token not found!", {});
      }
      if (tokenResetPassword.used) {
        throw new NotFoundException("Token has been used!", {});
      }
      if (tokenResetPassword.expiresAt < new Date()) {
        throw new NotFoundException("Token has expired!", {});
      }
      return tokenResetPassword;
    } catch (error) {
      throw error;
    }
  }
}
