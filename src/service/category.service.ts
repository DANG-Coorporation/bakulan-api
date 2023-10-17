import Category, { CategoryAttributes } from "../database/models/categories";

export default class CategoryService {
  async getCategories() {
    try {
      const categories = await Category.findAll();
      return categories;
    } catch (error) {
      throw error;
    }
  }

  async createCategory(name: string, description: string) {
    try {
      const category = await Category.create({
        name,
        description,
        created_at: new Date(),
        updated_at: new Date(),
      });
      return category;
    } catch (error) {
      throw error;
    }
  }

  async editCategory(id: number, name: string, description: string) {
    try {
      const category = await Category.findByPk(id);

      if (!category) {
        return null; // Category tidak ditemukan
      }

      // Update kategori
      category.name = name;
      category.description = description;

      await category.save();
      return category;
    } catch (error) {
      throw error;
    }
  }

  async deleteCategory(categoryId: number): Promise<number> {
    try {
      const deletedCategory = await Category.destroy({
        where: { id: categoryId },
      });

      return deletedCategory;
    } catch (error) {
      throw error;
    }
  }
}
