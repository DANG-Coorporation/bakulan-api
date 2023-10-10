import { DataTypes, Model, Optional } from "sequelize";
import Database from "../../config/db";

// Database connection instance
const databaseInstance = Database.database;

// User Interface
export interface MerchantAttributes {
  id: number;
  name: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface MerchantCreationAttributes
  extends Optional<MerchantAttributes, "id"> {}
export interface MerchantInstance extends Required<MerchantAttributes> {}
// Sequelize Model
class Merchants
  extends Model<MerchantAttributes, MerchantCreationAttributes>
  implements MerchantAttributes
{
  public id!: number;
  public name!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Merchants.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING(255),
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "merchants",
    sequelize: databaseInstance,
    underscored: true,
  }
);

export default Merchants;
