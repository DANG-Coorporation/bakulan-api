import * as jwt from "jsonwebtoken";
import configConstants from "../config/constants";
import { ForbiddenException } from "../helper/Error/Forbidden/ForbiddenException";

interface refreshTokenPayload {
  id: number;
  iat: number;
  exp: number;
}
export default class JwtService {
  async generateToken(payload: any) {
    return jwt.sign(payload, configConstants.JWT_SECRET_ACCESS_TOKEN, {
      expiresIn: "8h",
    });
  }

  async generateRefreshToken(payload: any) {
    return jwt.sign(payload, configConstants.JWT_SECRET_REFRESH_TOKEN, {
      expiresIn: "7d",
    });
  }

  async verifyToken(token: string) {
    try {
      return jwt.verify(token, configConstants.JWT_SECRET_ACCESS_TOKEN);
    } catch (error) {
      console.log("JwtService:verifyToken:error");
      throw new ForbiddenException("Invalid token", {});
    }
  }

  async verifyRefreshToken(token: string) {
    try {
      return jwt.verify(
        token,
        configConstants.JWT_SECRET_REFRESH_TOKEN
      ) as refreshTokenPayload;
    } catch (error) {
      console.log("JwtService:verifyRefreshToken:error");
      throw new ForbiddenException("Invalid token", {});
    }
  }
}
