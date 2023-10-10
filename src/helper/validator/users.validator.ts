import { body } from "express-validator";
import validate from "../function/express-validator";

export const createOwnerValidator = () =>
  validate([
    body("username")
      .isString()
      .withMessage("Username must be a string")
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 6 }),
    body("email").isEmail().withMessage("Email must be a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
  ]);

  export const createCashierValidator = () =>
    validate([
      body("username")
        .isString()
        .withMessage("Username must be a string")
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 6 }),
      body("email").isEmail().withMessage("Email must be a valid email"),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
      body("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password confirmation does not match password");
        }
        return true;
      }),
    ]);

export const loginValidator = () =>
  validate([
    body("username")
      .isString()
      .withMessage("Username must be a string")
      .notEmpty()
      .withMessage("Username is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ]);

  export const refreshTokenValidator = () =>
    validate([
      body("refreshToken")
        .isString()
        .withMessage("Refresh token must be a string")
        .notEmpty()
        .withMessage("Refresh token is required"),
    ]);

    export const addMerchantValidator = () =>
      validate([
        body("name")
          .isString()
          .withMessage("Name must be a string")
          .notEmpty()
          .withMessage("Name is required"),
      ]);