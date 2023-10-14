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

  // async  filterProductsByCategory(category) {
  //   // Implement the database query to filter products by category
  //   const filteredProducts = await Product.findAll({
  //     where: {
  //       category: {
  //         [Op.like]: `%${category}%`,
  //       },
  //     }
  //   })
  // }

  async filterProductsByName(name: string) {
    try {
      const filteredProducts = await Product.findAll({
        where: {
          name: {
            [Op.like]: `%${name}%`,
          },
        },
      });
      return filteredProducts;
    } catch (error) {
      console.log("Error filtering products by name:", error);
      throw error;
    }
  }

  async sortProductsByName(order: string): Promise<ProductAttributes[]> {
    try {
      const products = await Product.findAll({
        order: [["name", order === "asc" ? "ASC" : "DESC"]],
      });
      return products;
    } catch (error) {
      console.log("Error sorting products by name:", error);
      throw error;
    }
  }

  async sortProductByPrice(order: string): Promise<ProductAttributes[]> {
    const products = await Product.findAll({
      order: [["price", order === "asc" ? "ASC" : "DESC"]],
    });
    return products;
  }
}
