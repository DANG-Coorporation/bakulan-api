import { Request, Response } from "express";
import { ProcessError } from "../helper/Error/errorHandler";
import ProductService from "../service/product.service";

const productService = new ProductService();

export default class ProductController {
  async getProducts(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      const input = {
        page,
        limit,
        data: req.query,
      };

      const result = await productService.getProducts(input);

      res.json({
        statusCode: 200,
        message: "success",
        data: result,
      });
    } catch (err) {
      console.log(err);
      ProcessError(err, res);
    }
  }

  // async filterProductsByCategory(req: Request, res: Response) {
  //   try {
  //     const { category } = req.params;

  //     const filteredProducts = await productService.filterProductsByCategory(
  //       category
  //     );
  //     res.json({
  //       statusCode: 200,
  //       message: "success",
  //       data: filteredProducts,
  //     });
  //   } catch (err) {
  //     console.log(err);
  //     ProcessError(err, res);
  //   }
  // }

  async filterProductsByName(req: Request, res: Response) {
    try {
      const { name } = req.params;

      const filteredProducts = await productService.filterProductsByName(name);

      res.json({
        statusCode: 200,
        message: "success",
        data: filteredProducts,
      });
    } catch (err) {
      console.log(err);
      ProcessError(err, res);
    }
  }

  async sortProductsByName(req: Request, res: Response) {
    try {
      const { order } = req.params;
      const sortedProducts = await productService.sortProductsByName(order);
      res.json({
        statusCode: 200,
        message: "success",
        data: sortedProducts,
      });
    } catch (err) {
      console.log(err);
      ProcessError(err, res);
    }
  }

  async sortProductByPrice(req: Request, res: Response) {
    try {
      const { order } = req.params;
      const sortedProducts = await productService.sortProductByPrice(order);
      res.json({
        statusCode: 200,
        message: "success",
        data: sortedProducts,
      });
    } catch (err) {
      console.log(err);
      ProcessError(err, res);
    }
  }
}
