import { Servico } from "../models/associations.js";
import { servicoSchema } from "../schemas/servicoSchema.js";

class ServicoController {
  static async listar(req, res) {
    try {
      const servicos = await Servico.findAll({
        where: {
          ativo: true,
        },
        order: [["nome", "ASC"]],
      });

      return res.status(200).json(servicos);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
      return res.status(500).json({ message: "Erro ao buscar serviços" });
    }
  }

  static async criar(req, res) {
    try {
      
      const resultado = servicoSchema.safeParse(req.body);
      if (!resultado.success) {
        return res
          .status(400)
          .json({ message: resultado.error.issues[0].message });
      }

      const novoServico = await Servico.create(resultado.data);
      return res.status(201).json(novoServico);
    } catch (error) {
      console.error("Erro ao criar serviço:", error);
      return res.status(500).json({ message: "Erro ao criar serviço" });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const servico = await Servico.findByPk(id);

      if (!servico || !servico.ativo) {
        return res.status(404).json({ message: "Serviço não encontrado" });
      }
      return res.status(200).json(servico);
    } catch (error) {
      console.error("Erro ao buscar serviço:", error);
      return res.status(500).json({ message: "Erro ao buscar serviço" });
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const resultado = servicoSchema.safeParse(req.body);


     if (!resultado.success) {
        return res
          .status(400)
          .json({ message: resultado.error.issues[0].message });
      }

      const servico = await Servico.findByPk(id);
      if (!servico) {
        return res.status(404).json({ message: "Serviço não encontrado" });
      }

      await servico.update(resultado.data);
      return res.status(200).json(servico);
    } catch (error) {
      console.error("Erro ao atualizar serviço:", error);
      return res.status(500).json({ message: "Erro ao atualizar serviço" });
    }
  }

  static async desativar(req, res) {
    try {
      const { id } = req.params;
      const servico = await Servico.findByPk(id);

      if (!servico) {
        return res.status(404).json({ message: "Serviço não encontrado" });
      }

      if (!servico.ativo) {
        return res.status(409).json({ message: "Serviço já está desativado" });
      }

      await servico.update({ ativo: false });
      return res.status(200).json(servico);
    } catch (error) {
      console.error("Erro ao desativar serviço:", error);
      return res.status(500).json({ message: "Erro ao desativar serviço" });
    }
  }

  static async reativar(req, res) {
    try {
      const { id } = req.params;
      const servico = await Servico.findByPk(id);

      if (!servico) {
        return res.status(404).json({ message: "Serviço não encontrado" });
      }

      if (servico.ativo) {
        return res.status(409).json({ message: "Serviço já está ativo" });
      }

      await servico.update({ ativo: true });
      return res.status(200).json(servico);
    } catch (error) {
      console.error("Erro ao reativar serviço:", error);
      return res.status(500).json({ message: "Erro ao reativar serviço" });
    }
  }
}

export default ServicoController;
