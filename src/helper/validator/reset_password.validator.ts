import { body, param } from "express-validator";
import validate from "../function/express-validator";

export const sendResetPasswordEmailValidator = () =>
  validate([
    body("email").isEmail().withMessage("Email must be a valid email"),
  ]);

export const resetPasswordValidator = () =>
  validate([
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
    param("token")
      .isString()
      .withMessage("Token must be a string")
      .notEmpty()
      .withMessage("Token is required"),
  ]);
