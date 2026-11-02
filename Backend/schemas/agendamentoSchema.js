import { z } from "zod";
import { nomeSchema, telefoneSchema } from "./campos.js";

export const agendamentoSchema = z.object({
  nome: nomeSchema,
  telefone: telefoneSchema,

  servicoId: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "O ID do serviço é obrigatório."
          : "O ID do serviço deve ser um número.",
    })
    .int("O ID do serviço deve ser um número inteiro.")
    .positive("O ID do serviço deve ser um número positivo."),

  barbeiroId: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "O ID do barbeiro é obrigatório."
          : "O ID do barbeiro deve ser um número.",
    })
    .int("O ID do barbeiro deve ser um número inteiro.")
    .positive("O ID do barbeiro deve ser um número positivo."),

  dataHora: z.iso
    .datetime({
      local: true,
      error: "Data inválida. Use o formato AAAA-MM-DDTHH:mm:ss.",
    })
    .transform((valor) => new Date(valor))
    .refine((data) => data > new Date(), "Não é possível agendar no passado."),
});
