import bcrypt from "bcryptjs";
import sequelize from "../config/conn.js";
import { Admin } from "../models/associations.js";
import { authSchema } from "../schemas/authSchema.js";
import { email } from "zod";

const criarAdmin = async () => {
  try {
    // 1. ler nome, email e senha do process.env
    const { ADMIN_NOME, ADMIN_EMAIL, ADMIN_SENHA } = process.env;

    // 2. se faltar algum → avisa e para
    if (!ADMIN_NOME) {
      console.log(
        "Por favor, preencha as variáveis ADMIN_NOME, ADMIN_EMAIL e ADMIN_SENHA no arquivo .env",
      );
      return;
    }
    //
    const resultado = authSchema.safeParse({
      email: ADMIN_EMAIL,
      senha: ADMIN_SENHA,
    });

    if (!resultado.success) {
      resultado.error.issues[0].message;
      return;
    }

    // 3. já existe admin com esse email? → avisa e para
    const adminExistente = await Admin.findOne({
      where: { email: ADMIN_EMAIL },
    });
    if (adminExistente) {
      console.log("Já existe um administrador com esse email:", ADMIN_EMAIL);
      return;
    }

    // 4. gerar o hash da senha
    const senhaHash = await bcrypt.hash(ADMIN_SENHA, 10);

    //5.criar o admin no banco

    const novoAdmin = await Admin.create({
      nome: ADMIN_NOME,
      email: ADMIN_EMAIL,
      senha: senhaHash,
    });

    console.log("Administrador criado com sucesso:", {
      id: novoAdmin.id,
      nome: novoAdmin.nome,
      email: novoAdmin.email,
    });
  } catch (error) {
    console.error("Erro ao criar administrador:", error);
  } finally {
    await sequelize.close();
  }
};

criarAdmin();
