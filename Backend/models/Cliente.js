import { DataTypes, Model } from "sequelize";
import sequelize from "../config/conn.js";

class Cliente extends Model {}

Cliente.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    telefone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Cliente",
    tableName: "clientes",
    underscored: true,
  },
);

export default Cliente;
