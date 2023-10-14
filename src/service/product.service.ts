import { Op } from "sequelize";
import Product, { ProductAttributes } from "../database/models/products";
import { NotFoundException } from "../helper/Error/NotFound/NotFoundException";
import { IPaginate } from "../helper/interface/paginate/paginate.interface";

export default class ProductService {
  async getProducts(input: IPaginate<ProductAttributes>) {
    try {
      const page = input.page ?? 1;
      const limit = input.limit ?? 5;
      const offset = (page - 1) * limit;

      const products = await Product.findAndCountAll({
        offset,
        limit,
        order: [["createdAt", "DESC"]],
      });

      const totalPages = Math.ceil(products.count / limit);

      return { products: products.rows, totalPages };
    } catch (error) {
      console.error("Error mendapatkan pagination", error);
      throw error;
    }
  }
}
