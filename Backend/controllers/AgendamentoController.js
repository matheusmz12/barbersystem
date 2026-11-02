import { Op } from "sequelize";
import {
  Agendamento,
  Barbeiro,
  Cliente,
  Servico,
} from "../models/associations.js";
import { agendamentoSchema } from "../schemas/agendamentoSchema.js";
import { calcularFim } from "../utils/horario.js";

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

      // Verificar se o barbeiro existe e está ativo
      const barbeiro = await Barbeiro.findOne({
        where: { id: barbeiroId, ativo: true },
      });
      if (!barbeiro) {
        return res
          .status(404)
          .json({ message: "Barbeiro não encontrado ou inativo" });
      }

      // Verificar se o serviço existe e está ativo
      const servico = await Servico.findOne({
        where: { id: servicoId, ativo: true },
      });
      if (!servico) {
        return res
          .status(404)
          .json({ message: "Serviço não encontrado ou inativo" });
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
      });

      if (conflito) {
        return res
          .status(409)
          .json({ message: "Conflito de agendamento com outro horário" });
      }

      // Buscar o cliente pelo telefone ou criar (mantém o nome antigo)
      const [cliente] = await Cliente.findOrCreate({
        where: { telefone },
        defaults: { nome },
      });

      // Criar o agendamento (preço é snapshot do serviço; status usa o default)
      const agendamento = await Agendamento.create({
        clienteId: cliente.id,
        barbeiroId,
        servicoId,
        dataHora,
        dataHoraFim,
        precoCobrado: servico.preco,
      });
      return res.status(201).json(agendamento);
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      return res.status(500).json({ message: "Erro ao criar agendamento" });
    }
  }
}

export default AgendamentoController;
