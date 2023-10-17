import { DataTypes, Model, Optional } from "sequelize";
import Database from "../../config/db";
const database = Database.database;

// 1	id	int	NULL	NULL	NO	NULL	auto_increment
// 2	filename	varchar(255)	utf8mb4	utf8mb4_0900_ai_ci	YES	NULL
// 3	pathname	varchar(255)	utf8mb4	utf8mb4_0900_ai_ci	YES	NULL
// 4	bucketname	varchar(255)	utf8mb4	utf8mb4_0900_ai_ci	YES	NULL
// 5	type	varchar(50)	utf8mb4	utf8mb4_0900_ai_ci	YES	NULL
// 6	created_at	datetime	NULL	NULL	YES	CURRENT_TIMESTAMP	DEFAULT_GENERATED
// 7	updated_at	datetime	NULL	NULL	YES	CURRENT_TIMESTAMP	DEFAULT_GENERATED on update CURRENT_TIMESTAMP

export interface DocumentAttributes {
  id: number;
  filename: string;
  pathname: string;
  bucketname: string;
  type: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface DocumentCreationAttributes
  extends Optional<DocumentAttributes, "id"> {}

export interface DocumentInstance extends Required<DocumentAttributes> {}

class Document
  extends Model<DocumentAttributes, DocumentCreationAttributes>
  implements DocumentAttributes
{
  public id!: number;
  public filename!: string;
  public pathname!: string;
  public bucketname!: string;
  public type!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Document.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    filename: DataTypes.STRING(255),
    pathname: DataTypes.STRING(255),
    bucketname: DataTypes.STRING(255),
    type: DataTypes.STRING(50),
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "documents",
    sequelize: database,
    underscored: true,
  }
);

export default Document;
