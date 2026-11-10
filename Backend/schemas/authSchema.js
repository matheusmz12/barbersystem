import {z} from "zod";

export const authSchema = z.object({
  email: z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? "O email é obrigatório."
        : "O email deve ser enviado como texto.",
  })
  .trim()
  .toLowerCase()
  .min(1, "O email é obrigatório.")
  .email("Por favor, insira um email válido."),

  senha: z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? "A senha é obrigatória."
        : "A senha deve ser enviada como texto.",
  })
  .min(1, "A senha é obrigatória.")
  
});
