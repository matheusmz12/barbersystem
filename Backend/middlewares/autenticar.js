import jwt from "jsonwebtoken";

function autenticar(req, res, next) {
  // 1. pegar o header Authorization
  const authHeader = req.headers["authorization"];

  // 2. não veio ou não começa com "Bearer " → 401
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Acesso negado" });
  }

  // 3. separar o token
  const token = authHeader.split(" ")[1];

  // 4. verificar o token (try/catch)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // → válido → pendurar o id no req e chamar next()

    req.adminId = decoded.id;

    return next();
  } catch {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}

export default autenticar;
