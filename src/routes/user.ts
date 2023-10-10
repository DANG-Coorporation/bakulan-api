import { Router } from "express";
import { UserController } from "../controllers/user";
import {
  addMerchantValidator,
  createCashierValidator,
} from "../helper/validator/users.validator";

export default class UserRouter {
  router: Router;
  userController: UserController;

  constructor() {
    // Initialize controllers objects
    this.userController = new UserController();

    // Initialize router object
    this.router = Router({ mergeParams: true });
    this.userRoutes();
    console.info("/api/user routes initialized");
  }

  private userRoutes() {
    this.router.get("/", (req, res) => {
      res.json({
        message: "Welcome to the API",
      });
    });

    this.router.post("/create-cashier", createCashierValidator(), (req, res) =>
      this.userController.createCashier(req, res)
    );

    this.router.post("/add-merchant", addMerchantValidator(), (req, res) =>
      this.userController.addMerchant(req, res)
    );
  }
}
