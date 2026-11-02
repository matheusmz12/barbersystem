import { z } from "zod";

export const servicoSchema = z.object({
  nome: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "O nome é obrigatório."
          : "O nome deve ser enviado como texto.",
    })
    .trim()
    .min(1, "O nome do serviço é obrigatório.")
    .max(100, "O nome pode ter no máximo 100 caracteres."),

  preco: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "O valor é obrigatório."
          : "O valor deve ser um número.",
    })
    .min(0, "O preço do serviço não pode ser negativo."),

  duracaoMinutos: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "A duração é obrigatória."
          : "A duração deve ser um número.",
    })
    .int("A duração deve ser um número inteiro.")
    .positive("A duração deve ser maior que zero."),
});
