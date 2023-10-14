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
}
