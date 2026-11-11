import jwt from "jsonwebtoken";
import { TEMPO_EXPIRACAO_TOKEN } from "../config/auth.js";

export const gerarToken = (adminId) => {
  return jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
    expiresIn: TEMPO_EXPIRACAO_TOKEN,
  });
};
