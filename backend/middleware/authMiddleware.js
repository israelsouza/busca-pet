import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/authConfig.js";

export default function autenticarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "Token não fornecido" });

  const token = authHeader.split(" ")[1]; // Extrai o token do cabeçalho Authorization

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Verifica o token
    req.user = decoded; // Adiciona os dados do usuário ao objeto request
    next(); // Continua para a próxima função
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expirado" }); // Erro específico para token expirado
    }
    return res.status(403).json({ message: "Token inválido" });
  }
}
