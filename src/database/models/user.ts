"use strict";
import { DataTypes, Model, Optional } from "sequelize";
import Database from "../../config/db";
import Document from "./document";
import Merchants from "./merchant";

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
  pictureId?: number;
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
  public pictureId!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Model associations are defined here
  static associate(models: any) {
    Users.belongsTo(models.Merchant, {
      foreignKey: "merchantId",
      as: "merchant",
    });
    Users.belongsTo(models.Picture, {
      foreignKey: "pictureId",
      as: "picture",
    });
  }
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
    merchantId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "merchants",
        key: "id",
      },
    },
    pictureId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "documents",
        key: "id",
      },
    },
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

Users.belongsTo(Merchants, {
  foreignKey: "merchantId",
  as: "merchant",
});

Merchants.hasOne(Users, {
  foreignKey: "merchantId",
  as: "merchant",
});

export default Users;
