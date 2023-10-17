import { DataTypes, Model, Optional } from "sequelize";
import Database from "../../config/db";

const databaseInstance = Database.database;

export interface CategoryAttributes {
  id: number;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, "id"> {}
export interface CategoryInstance extends Required<CategoryAttributes> {}

class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: number;
  public name!: string;
  public description!: string;
  public created_at!: Date;
  public updated_at!: Date;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING(255),
    description: DataTypes.TEXT,
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "categories",
    sequelize: databaseInstance,
    underscored: true,
  }
);

export default Category;
