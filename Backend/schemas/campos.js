import { z } from "zod";
import { normalizarTelefone } from "../utils/telefone.js";

export const nomeSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? "O nome é obrigatório."
        : "O nome deve ser enviado como texto.",
  })
  .trim()
  .min(1, "O nome é obrigatório.")
  .max(100, "O nome pode ter no máximo 100 caracteres.");

export const telefoneSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? "O telefone é obrigatório."
        : "O telefone deve ser enviado como texto.",
  })
  .transform(normalizarTelefone)
  .refine((valor) => valor !== null, "O telefone fornecido é inválido.");
