import { DataTypes, Model, Optional } from "sequelize";
import Database from "../../config/db";

// Database connection instance
const databaseInstance = Database.database;

// User Interface
export interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  merchantId?: number;
  pictureId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, "id"> {}
export interface UserInstance extends Required<UserAttributes> {}
// Sequelize Model
class Users
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public isAdmin!: boolean;
  public merchantId!: number;
  public pictureId!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Users.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: DataTypes.STRING(255),
    password: DataTypes.STRING(255),
    email: DataTypes.STRING(255),
    isAdmin: DataTypes.BOOLEAN,
    merchantId: DataTypes.INTEGER,
    pictureId: DataTypes.STRING(255),
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "users",
    sequelize: databaseInstance,
    underscored: true,
  }
);

export default Users;
