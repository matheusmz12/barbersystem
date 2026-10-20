import { Servico } from "../models/associations.js";

function validarServico(data) {
  const { nome, preco, duracaoMinutos } = data;

  if (typeof nome !== "string" || nome.trim() === "") {
    return { valido: false, message: "O nome do serviço é obrigatório." };
  }

  if (nome.trim().length > 100) {
    return {
      valido: false,
      message: "O nome pode ter no máximo 100 caracteres.",
    };
  }

  if (typeof preco !== "number" || preco < 0) {
    return {
      valido: false,
      message: "O preço do serviço não pode ser negativo.",
    };
  }

  if (!Number.isInteger(duracaoMinutos) || duracaoMinutos <= 0)
    return {
      valido: false,
      message: "A duração do serviço deve ser um número inteiro positivo.",
    };


    return{
        valido: true,
        dados:{
            nome: nome.trim(),
            preco,
            duracaoMinutos
        }
    }
//   return { valido: true };
}

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
      const { nome, preco, duracaoMinutos } = req.body;

      const validacao = validarServico({ nome, preco, duracaoMinutos });
      if (!validacao.valido) {
        return res.status(400).json({ message: validacao.message });
      }

      const novoServico = await Servico.create(validacao.dados);
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
      const { nome, preco, duracaoMinutos } = req.body;

      const validacao = validarServico({ nome, preco, duracaoMinutos });
      if (!validacao.valido) {
        return res.status(400).json({ message: validacao.message });
      }

      const servico = await Servico.findByPk(id);
      if (!servico) {
        return res.status(404).json({ message: "Serviço não encontrado" });
      }

      await servico.update(validacao.dados);
      return res.status(200).json(servico);
    } catch (error) {
      console.error("Erro ao atualizar serviço:", error);
      return res.status(500).json({ message: "Erro ao atualizar serviço" });
    }
  }
}

export default ServicoController;
