import express, { Request, Response, Router } from "express";
import ProductController from "../controllers/productController";

export default class ProductRouter {
  public router: Router;
  private productController: ProductController;

  constructor() {
    // Initialize controllers objects
    this.router = Router();
    this.productController = new ProductController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", this.productController.getProducts);
  }
}
