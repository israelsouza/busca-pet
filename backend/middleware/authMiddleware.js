import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../configs/authConfig.js";
import UserModel from "../model/UserModel.js";
import log from "../utils/logger.js";

export default async function autenticarToken(req, res, next) {
  log("INFO", "authMiddleware", "autenticarToken", "INICIO");
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "Token não fornecido" });

  const token = authHeader.split(" ")[1]; // Extrai o token do cabeçalho Authorization

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Verifica o token
    req.user = decoded; // Adiciona os dados do usuário ao objeto request

    log("INFO", "authMiddleware", "autenticarToken", "Token verificado e ADICIONADO ao REQUEST com sucesso");

    const usuario = await UserModel.listarDadosUsuario(decoded.id);
    
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    if (usuario.USU_STATUS === "B") {
      log("INFO", "authMiddleware", "autenticarToken", "Usuário banido. Acesso negado.");
      return res.status(403).json({ message: "Usuário banido. Acesso negado.", status: 403 });
    }

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expirado" }); 
    }
    return res.status(403).json({ message: "Token inválido" });
  }
}
