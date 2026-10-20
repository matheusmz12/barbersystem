import { DataTypes, Model } from "sequelize";
import sequelize from "../config/conn.js";

class Servico extends Model {}

Servico.init(
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

    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    duracaoMinutos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Servico",
    tableName: "servicos",
    underscored: true,
  },
);

export default Servico;
