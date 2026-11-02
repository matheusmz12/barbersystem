import { z } from "zod";
import { telefoneSchema, nomeSchema } from "./campos.js";

export const barbeiroSchema = z.object({
  nome: nomeSchema,
  telefone: telefoneSchema,
});
