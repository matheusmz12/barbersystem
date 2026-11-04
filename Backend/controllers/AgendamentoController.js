import { Op } from "sequelize";
import sequelize from "../config/conn.js";
import {
  Agendamento,
  Barbeiro,
  Cliente,
  Servico,
} from "../models/associations.js";

import {
  agendamentoSchema,
  listarAgendamentoSchema,
} from "../schemas/agendamentoSchema.js";
import { calcularFim } from "../utils/horario.js";


const incluirRelacionados = [
  { model: Cliente, attributes: ["id", "nome", "telefone"] },
  { model: Barbeiro, attributes: ["id", "nome"] },
  { model: Servico, attributes: ["id", "nome"] },
];

class AgendamentoController {
  static async criar(req, res) {
    try {
      // Validação do corpo da requisição
      const resultado = agendamentoSchema.safeParse(req.body);
      if (!resultado.success) {
        return res
          .status(400)
          .json({ message: resultado.error.issues[0].message });
      }

      const { nome, telefone, servicoId, barbeiroId, dataHora } =
        resultado.data;

      const resposta = await sequelize.transaction(async (t) => {
        const barbeiro = await Barbeiro.findOne({
          where: { id: barbeiroId, ativo: true },
          transaction: t,
          lock: t.LOCK.UPDATE, // Bloqueia a linha do barbeiro para evitar conflitos
        });

        // Verificar se o barbeiro existe e está ativo

        if (!barbeiro) {
          return {
            status: 404,
            body: { message: "Barbeiro não encontrado ou inativo" },
          };
        }

        // Verificar se o serviço existe e está ativo
        const servico = await Servico.findOne({
          where: { id: servicoId, ativo: true },
          transaction: t,
        });
        if (!servico) {
          return {
            status: 404,
            body: { message: "Serviço não encontrado ou inativo" },
          };
        }

        // Calcular o horário de término do agendamento
        const dataHoraFim = calcularFim(dataHora, servico.duracaoMinutos);

        // Conflito com outro agendamento desse barbeiro? → 409
        const conflito = await Agendamento.findOne({
          where: {
            barbeiroId,
            status: { [Op.ne]: "cancelado" },
            dataHora: { [Op.lt]: dataHoraFim },
            dataHoraFim: { [Op.gt]: dataHora },
          },
          transaction: t,
        });

        if (conflito) {
          return {
            status: 409,
            body: {
              message: "Conflito de agendamento para o barbeiro nesse horário",
            },
          };
        }

        // Buscar o cliente pelo telefone ou criar (mantém o nome antigo)
        const [cliente] = await Cliente.findOrCreate({
          where: { telefone },
          defaults: { nome },
          transaction: t,
        });

        // Criar o agendamento (preço é snapshot do serviço; status usa o default)
        const agendamento = await Agendamento.create(
          {
            clienteId: cliente.id,
            barbeiroId,
            servicoId,
            dataHora,
            dataHoraFim,
            precoCobrado: servico.preco,
          },
          { transaction: t },
        );
        return { status: 201, body: agendamento };
      });

      return res.status(resposta.status).json(resposta.body);
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      return res.status(500).json({ message: "Erro ao criar agendamento" });
    }
  }

  static async listar(req, res) {
    try {
      const resultado = listarAgendamentoSchema.safeParse(req.query);
      if (!resultado.success) {
        return res
          .status(400)
          .json({ message: resultado.error.issues[0].message });
      }

      const { data, barbeiroId } = resultado.data;

      const where = {};
      if (barbeiroId) {
        where.barbeiroId = barbeiroId;
      }

      if (data) {
        const inicio = new Date(`${data}T00:00:00`);
        const fim = new Date(inicio);
        fim.setDate(fim.getDate() + 1); // Adiciona um dia para incluir todo o dia

        where.dataHora = {
          [Op.gte]: inicio,
          [Op.lt]: fim,
        };
      }

      const agendamentos = await Agendamento.findAll({
        include: incluirRelacionados,
        order: [["dataHora", "ASC"]],
        where,
      });

      return res.status(200).json(agendamentos);
    } catch (error) {
      console.error("Erro ao listar agendamentos:", error);
      return res.status(500).json({ message: "Erro ao listar agendamentos" });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const agendamento = await Agendamento.findByPk(id, {
        include: incluirRelacionados,
      });

      if (!agendamento) {
        return res.status(404).json({ message: "Agendamento não encontrado" });
      }

      return res.status(200).json(agendamento);
    } catch (error) {
      console.error("Erro ao buscar agendamento por ID:", error);
      return res.status(500).json({
        message: "Erro ao buscar agendamento por ID",
      });
    }
  }
}

export default AgendamentoController;
