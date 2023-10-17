import { DataTypes, Model, Optional } from "sequelize";
import Database from "../../config/db";

const database = Database.database;

export interface TokenResetPasswordAttributes {
  id: number;
  token: string;
  userId: number;
  used: boolean;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TokenResetPasswordCreationAttributes
  extends Optional<TokenResetPasswordAttributes, "id"> {}

export interface TokenResetPasswordInstance
  extends Model<
    TokenResetPasswordAttributes,
    TokenResetPasswordCreationAttributes
  > {}

class TokenResetPassword
  extends Model<
    TokenResetPasswordAttributes,
    TokenResetPasswordCreationAttributes
  >
  implements TokenResetPasswordAttributes
{
  public id!: number;
  public token!: string;
  public userId!: number;
  public used!: boolean;
  public expiresAt!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TokenResetPassword.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    token: DataTypes.STRING(100),
    userId: DataTypes.INTEGER,
    used: DataTypes.BOOLEAN,
    expiresAt: DataTypes.DATE,
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "token_reset_password",
    sequelize: database,
    underscored: true,
  }
);

export default TokenResetPassword;
