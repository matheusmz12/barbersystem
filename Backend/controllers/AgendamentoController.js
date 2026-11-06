import { Op } from "sequelize";
import sequelize from "../config/conn.js";

import { DIAS_FECHADOS } from "../config/funcionamento.js";

import { calcularFim, gerarCandidatos, conflita } from "../utils/horario.js";

import {
  Agendamento,
  Barbeiro,
  Cliente,
  Servico,
} from "../models/associations.js";

import {
  agendamentoSchema,
  listarAgendamentoSchema,
  horariosLivresSchema,
} from "../schemas/agendamentoSchema.js";

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

  static async concluir(req, res) {
    try {
      const { id } = req.params;
      const agendamento = await Agendamento.findByPk(id);

      if (!agendamento) {
        return res.status(404).json({ message: "Agendamento não encontrado" });
      }

      if (agendamento.status !== "agendado") {
        return res.status(409).json({
          message: `Não é possível concluir um agendamento com status ${agendamento.status}.`,
        });
      }

      if (agendamento.dataHora > new Date()) {
        return res.status(409).json({
          message:
            "Não é possível concluir um agendamento que ainda não começou.",
        });
      }

      await agendamento.update({ status: "concluido" });
      return res.status(200).json(agendamento);
    } catch (error) {
      console.error("Erro ao concluir agendamento:", error);
      return res.status(500).json({ message: "Erro ao concluir agendamento" });
    }
  }

  static async cancelar(req, res) {
    try {
      const { id } = req.params;
      const agendamento = await Agendamento.findByPk(id);

      if (!agendamento) {
        return res.status(404).json({ message: "Agendamento não encontrado" });
      }

      if (agendamento.status !== "agendado") {
        return res.status(409).json({
          message: `Não é possível cancelar um agendamento com status ${agendamento.status}.`,
        });
      }

      await agendamento.update({ status: "cancelado" });
      return res.status(200).json(agendamento);
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
      return res.status(500).json({ message: "Erro ao cancelar agendamento" });
    }
  }

  static async horariosLivres(req, res) {
    try {
      // 1. validar → 400

      const resultado = horariosLivresSchema.safeParse(req.query);
      if (!resultado.success) {
        return res
          .status(400)
          .json({ message: resultado.error.issues[0].message });
      }

      const { data, barbeiroId, servicoId } = resultado.data;

      // 2. dia fechado? → 200 com []
      const inicioDoDia = new Date(`${data}T00:00:00`);

      if (DIAS_FECHADOS.includes(inicioDoDia.getDay())) {
        return res.status(200).json([]);
      }

      // 3 e 4. barbeiro e serviço → 404
      const barbeiro = await Barbeiro.findOne({
        where: { id: barbeiroId, ativo: true },
      });

      if (!barbeiro) {
        return res
          .status(404)
          .json({ message: "Barbeiro não encontrado ou inativo" });
      }

      const servico = await Servico.findOne({
        where: { id: servicoId, ativo: true },
      });

      if (!servico) {
        return res
          .status(404)
          .json({ message: "Serviço não encontrado ou inativo" });
      }

      // 5. agendamentos do barbeiro no dia, UMA consulta só

      const fimDoDia = new Date(inicioDoDia);
      fimDoDia.setDate(fimDoDia.getDate() + 1);

      const agendamentos = await Agendamento.findAll({
        where: {
          barbeiroId,
          status: { [Op.ne]: "cancelado" },
          dataHora: { [Op.gte]: inicioDoDia, [Op.lt]: fimDoDia },
        },
      });

      // 6. todos os horarios possiveis
      const candidatos = gerarCandidatos(data, servico.duracaoMinutos);

      // 7. filtrar os que não conflitam
      const agora = new Date();

      const livres = candidatos.filter((inicio) => {
        const fim = calcularFim(inicio, servico.duracaoMinutos);

        const noFuturo = inicio > agora;
        const semConflito = !agendamentos.some((agendamento) => {
          return conflita(inicio, fim , agendamento.dataHora, agendamento.dataHoraFim);
        });

        return noFuturo && semConflito;
      });

      // 8. retornar
      return res.status(200).json(livres);
    } catch (error) {
      console.error("Erro ao buscar horários livres:", error);
      return res
        .status(500)
        .json({ message: "Erro ao buscar horários livres" });
    }
  }
}

export default AgendamentoController;
