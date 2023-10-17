import express, { Request, Response, Router } from "express";
import CategoryController from "../controllers/categoryController";

export default class CategoryRouter {
  public router: Router;
  private categoryController: CategoryController;

  constructor() {
    // Initialize controllers objects
    this.router = Router();
    this.categoryController = new CategoryController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", this.categoryController.getCategories);

    this.router.post("/", this.categoryController.createCategory);

    this.router.put("/:id", this.categoryController.editCategory);

    this.router.delete("/:id", this.categoryController.deleteCategory);
  }
}
