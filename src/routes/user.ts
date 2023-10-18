import { Router } from "express";
import { UserController } from "../controllers/user";
import {
  addMerchantValidator,
  createCashierValidator,
  updateCashierValidator,
} from "../helper/validator/users.validator";
import { param } from "express-validator";
import { multerMiddleware } from "../middleware/multer.middleware";

export default class UserRouter {
  router: Router;
  userController: UserController;

  constructor() {
    // Initialize controllers objects
    this.userController = new UserController();

    // Initialize router object
    this.router = Router({ mergeParams: true });
    this.userRoutes();
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

    this.router.delete("/cashier/:id", (req, res) =>
      this.userController.deleteCashier(req, res)
    );

    this.router.patch("/cashier/:id", updateCashierValidator(), (req, res) =>
      this.userController.updateCashier(req, res)
    );

    this.router.patch("/photo-profile", multerMiddleware, (req, res) =>
      this.userController.updateProfile(req, res)
    );

    this.router.get("/profile", (req, res) =>
      this.userController.getProfile(req, res)
    );
  }
}
