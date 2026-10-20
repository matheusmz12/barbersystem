import { DataTypes, Model } from "sequelize";
import sequelize from "../config/conn.js";

class Barbeiro extends Model {}

Barbeiro.init(
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
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },

  {
    sequelize,
    modelName: "Barbeiro",
    tableName: "barbeiros",
    underscored: true,
  },
);

export default Barbeiro;
