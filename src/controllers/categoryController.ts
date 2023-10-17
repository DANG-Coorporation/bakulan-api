import { Request, Response } from "express";
import { ProcessError } from "../helper/Error/errorHandler";
import CategoryService from "../service/category.service";

const categoryService = new CategoryService();

export default class CategoryController {
  async getCategories(req: Request, res: Response) {
    try {
      const categories = await categoryService.getCategories();
      res.json({ statusCode: 200, message: "Success", data: categories });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ statusCode: 500, message: "Internal Server Error" });
    }
  }

  async createCategory(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      if (!name || !description) {
        return res
          .status(400)
          .json({ error: "Name and description are required." });
      }

      const category = await categoryService.createCategory(name, description);
      return res.status(201).json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      return res.status(500).json({ error: "Failed to create category." });
    }
  }

  async editCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      // Validasi input
      if (!name || !description) {
        return res.status(400).json({
          statusCode: 400,
          message: "Name and description are required",
        });
      }

      const updatedCategory = await categoryService.editCategory(
        parseInt(id),
        name,
        description
      );

      if (updatedCategory) {
        res.json({
          statusCode: 200,
          message: "Category updated successfully",
          data: updatedCategory,
        });
      } else {
        res
          .status(404)
          .json({ statusCode: 404, message: "Category not found" });
      }
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ statusCode: 500, message: "Internal Server Error" });
    }
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const categoryId = parseInt(id);

      // Panggil layanan untuk menghapus kategori
      const deletedCategory = await categoryService.deleteCategory(categoryId);

      if (deletedCategory) {
        res.status(202).json({
          message: "Category deletion request accepted",
        });
      } else {
        res.status(404).json({ message: "Category not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Category deletion failed" });
    }
  }
}
