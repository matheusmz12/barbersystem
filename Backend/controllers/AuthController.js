import { Admin } from "../models/associations.js";
import bcrypt from "bcryptjs";
import { authSchema } from "../schemas/authSchema.js";
import { gerarToken } from "../utils/gerarToken.js";

class AuthController {
  static async login(req, res) {
    try {
      //validar 400
      const resultado = authSchema.safeParse(req.body);
      if (!resultado.success) {
        return res
          .status(400)
          .json({ message: resultado.error.issues[0].message });
      }

      const { email, senha } = resultado.data;

      //verificar se o usuario existe e a senha confere
      const adminExistente = await Admin.findOne({
        where: { email },
      });

      if (!adminExistente) {
        return res.status(401).json({ message: "Usuário ou senha inválidos" });
      }

      const senhaCorreta = await bcrypt.compare(senha, adminExistente.senha);

      if (!senhaCorreta) {
        return res.status(401).json({ message: "Usuário ou senha inválidos" });
      }

      return res.status(200).json({
        message: "Login realizado com sucesso",
        token: gerarToken(adminExistente.id),
        admin: {
          id: adminExistente.id,
          nome: adminExistente.nome,
          email: adminExistente.email,
        },
      });
    } catch (error) {
      console.error("Erro ao fazer login do Admin", error);
      return res.status(500).json({ message: "Erro ao fazer login" });
    }
  }
}

export default AuthController;
