import { Request, Response, Router } from "express";
import { UserController } from "../controllers/user";
import { body } from "express-validator";
import {
  createOwnerValidator,
  loginValidator,
  refreshTokenValidator,
} from "../helper/validator/users.validator";

export default class UsersRouter {
  router: Router;
  userController: UserController;

  constructor() {
    // Initialize controllers objects
    this.userController = new UserController();

    // Initialize router object
    this.router = Router({ mergeParams: true });
    this.userRoutes();
    console.info("/api/auth routes initialized");
  }

  private userRoutes() {
    this.router.get("/", (req, res) => {
      res.json({
        message: "Welcome to the API",
      });
    });

    this.router.post(
      "/create-owner",
      createOwnerValidator(),
      (req: Request, res: Response) => this.userController.createOwner(req, res)
    );

    this.router.post("/", loginValidator(), (req: Request, res: Response) =>
      this.userController.login(req, res)
    );

    this.router.post(
      "/refresh-token",
      refreshTokenValidator(),
      (req: Request, res: Response) =>
        this.userController.refreshToken(req, res)
    );
  }
}
