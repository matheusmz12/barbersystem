import { DataTypes, Model } from "sequelize";
import sequelize from "../config/conn.js";

class Agendamento extends Model {}

Agendamento.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dataHora: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("agendado", "concluido", "cancelado"),
      allowNull: false,
      defaultValue: "agendado",
    },
    precoCobrado: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },

    clienteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    barbeiroId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    servicoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Agendamento",
    tableName: "agendamentos",
    underscored: true,
  },
);

export default Agendamento;
