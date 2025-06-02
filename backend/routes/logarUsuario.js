import express from "express";
import verificarUsuarioDB from "../model/verificarUsuarioDB.js";
import jwt from 'jsonwebtoken'
import { SECRET_KEY } from "../configs/authConfig.js";

const router = express.Router();

router.post("/", async (request, response) => {
  const dados = request.body;
  try {

    const resultado = await verificarUsuarioDB(dados);

    // Gera o token JWT
    const token = jwt.sign(
      {email: dados.email}, // Payload
        SECRET_KEY,           // Chave secreta importada
      { expiresIn: "1d"}    // Tempo de expiração
    )
    console.log("entrei no login apos a geração do token ")

    // Retorna o token ao frontend
    return response
    .status(200)
    .json({ 
      message: resultado.message,
      userId: resultado.userId,
      token: token,
      role: resultado.role
     });

  } catch (error) {
    console.error("Erro no login:", error);
    

    if (error.message.includes("ORA-")) {
      response.status(400).json({ message: "Erro ao tentar logar. Verifique os dados e tente novamente." });
    } else {
      // Retorna a mensagem original para erros tratados
      response.status(400).json({ message: error.message });
    }
  }
});

export default router;
