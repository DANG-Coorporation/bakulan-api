import { HttpStatusCode } from "axios";
import { NextFunction, Request, Response } from "express";
import { ValidationChain, validationResult } from "express-validator";

const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.array().length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(HttpStatusCode.BadRequest).json({ errors: errors.array() });
  };
};

export default validate;
