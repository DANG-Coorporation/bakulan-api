import { Router } from "express";

export default class MainRouter {
  router: Router;

  constructor() {
    // Initialize controllers objects

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
  }
}
