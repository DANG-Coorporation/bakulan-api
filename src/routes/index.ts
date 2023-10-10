import { Router } from "express";

export default class MainRouter {
  router: Router;

  constructor() {
    // Initialize controllers objects

    // Initialize router object
    this.router = Router({ mergeParams: true });
    this.userRoutes();
    console.info("/ routes initialized");
  }

  private userRoutes() {
    this.router.get("/", (req, res) => {
      res.json({
        message: "Welcome to the API",
      });
    });
  }
}
