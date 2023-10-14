import { DataTypes, Model, Optional } from "sequelize";
import Database from "../../config/db";

const databaseInstance = Database.database;

export interface ProductAttributes {
  id: number;
  name: string;
  stock: number;
  document_id: number;
  status: string;
  price: number;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export interface ProductCreationAttributes
  extends Optional<ProductAttributes, "id"> {}
export interface ProductInstance extends Required<ProductAttributes> {}

class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: number;
  public name!: string;
  public stock!: number;
  public document_id!: number;
  public status!: string;
  public price!: number;
  public description!: string;
  public created_at!: Date;
  public updated_at!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING(255),
    stock: DataTypes.INTEGER,
    document_id: DataTypes.INTEGER,
    status: DataTypes.STRING(50),
    price: DataTypes.DECIMAL(10, 2),
    description: DataTypes.TEXT,
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "products",
    sequelize: databaseInstance,
    underscored: true,
  }
);

export default Product;
