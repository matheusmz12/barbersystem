import { Op } from "sequelize";
import { Barbeiro } from "../models/associations.js";
import { barbeiroSchema } from "../schemas/barbeiroSchema.js";

class BarbeiroController {
  static async listar(req, res) {
    try {
      const barbeiros = await Barbeiro.findAll({
        where: {
          ativo: true,
        },
        attributes: ["id", "nome"],
        order: [["nome", "ASC"]],
      });
      return res.status(200).json(barbeiros);
    } catch (error) {
      console.error("Erro ao listar barbeiros:", error);
      return res.status(500).json({ message: "Erro ao listar barbeiros" });
    }
  }

  static async criar(req, res) {
    try {
      const resultado = barbeiroSchema.safeParse(req.body);
      if (!resultado.success) {
        return res
          .status(400)
          .json({ message: resultado.error.issues[0].message });
      }

      // 1. Procura um barbeiro com o mesmo telefone

      const barbeiroExistente = await Barbeiro.findOne({
        where: { telefone: resultado.data.telefone },
      });

      if (barbeiroExistente) {
        if (!barbeiroExistente.ativo) {
          return res.status(409).json({
            message:
              "Este barbeiro já está cadastrado, mas está inativo. Deseja reativá-lo?",
            barbeiroId: barbeiroExistente.id,
          });
        }

        return res.status(409).json({
          message: "Já existe um barbeiro ativo cadastrado com este telefone.",
        });
      }

      const novoBarbeiro = await Barbeiro.create(resultado.data);
      return res.status(201).json(novoBarbeiro);
    } catch (error) {
      // Rede de segurança: duas requisições ao mesmo tempo podem passar pelo findOne
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({
          message: "Já existe um barbeiro cadastrado com este telefone.",
        });
      }
      console.error("Erro ao criar barbeiro:", error);
      return res.status(500).json({ message: "Erro ao criar barbeiro" });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;

      const barbeiro = await Barbeiro.findOne({
        where: {id,ativo: true},
        attributes: ["id", "nome"]
      });

      if (!barbeiro) {
        return res.status(404).json({ message: "Barbeiro não encontrado" });
      }

      return res.status(200).json(barbeiro);
    } catch (error) {
      console.error("Erro ao buscar barbeiro:", error);
      return res.status(500).json({ message: "Erro ao buscar barbeiro" });
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const resultado = barbeiroSchema.safeParse(req.body);

      if (!resultado.success) {
        return res
          .status(400)
          .json({ message: resultado.error.issues[0].message });
      }

      const barbeiro = await Barbeiro.findByPk(id);
      if (!barbeiro) {
        return res.status(404).json({ message: "Barbeiro não encontrado" });
      }

      // Procura OUTRO barbeiro com o mesmo telefone (o próprio barbeiro não conta)
      const outroComMesmoTelefone = await Barbeiro.findOne({
        where: {
          telefone: resultado.data.telefone,
          id: { [Op.ne]: barbeiro.id },
        },
      });

      if (outroComMesmoTelefone) {
        return res
          .status(409)
          .json({ message: "Já existe outro barbeiro com este telefone." });
      }

      await barbeiro.update(resultado.data);
      return res.status(200).json(barbeiro);
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res
          .status(409)
          .json({ message: "Já existe outro barbeiro com este telefone." });
      }
      console.error("Erro ao atualizar barbeiro:", error);
      return res.status(500).json({ message: "Erro ao atualizar barbeiro" });
    }
  }

  static async desativar(req, res) {
    try {
      const { id } = req.params;
      const barbeiro = await Barbeiro.findByPk(id);

      if (!barbeiro) {
        return res.status(404).json({ message: "Barbeiro não encontrado" });
      }

      if (!barbeiro.ativo) {
        return res.status(409).json({ message: "Barbeiro já está desativado" });
      }

      await barbeiro.update({ ativo: false });
      return res.status(200).json(barbeiro);
    } catch (error) {
      console.error("Erro ao desativar Barbeiro", error);
      return res.status(500).json({ message: "Erro ao desativar Barbeiro" });
    }
  }

  static async reativar(req, res) {
    try {
      const { id } = req.params;
      const barbeiro = await Barbeiro.findByPk(id);

      if (!barbeiro) {
        return res.status(404).json({ message: "Barbeiro não encontrado" });
      }

      if (barbeiro.ativo) {
        return res.status(409).json({ message: "Barbeiro já está ativo" });
      }

      await barbeiro.update({ ativo: true });
      return res.status(200).json(barbeiro);
    } catch (error) {
      console.error("Erro ao reativar Barbeiro:", error);
      return res.status(500).json({ message: "Erro ao reativar Barbeiro" });
    }
  }
}

export default BarbeiroController;
