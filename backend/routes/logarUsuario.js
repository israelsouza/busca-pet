import express from "express";
import verificarUsuarioDB from "../model/verificarUsuarioDB.js";
import jwt from 'jsonwebtoken'
import { SECRET_KEY } from "../config/authConfig.js";

const router = express.Router();

router.post("/", async (request, response) => {
  const dados = request.body;
  try {

    await verificarUsuarioDB(dados);

    // Gera o token JWT
    const token = jwt.sign(
      {email: dados.email}, // Payload
      SECRET_KEY,           // Chave secreta importada
      { expiresIn: "10m"}    // Tempo de expiração
    )
    console.log("entrei apos a geração do token ")

    // Retorna o token ao frontend
    response
    .status(200)
    .json({ 
      message: "Login realizado com sucesso",
      token: token,
     });

    

  } catch (error) {
    console.error("Erro ao logar com o usuário: -> ", error);

    if (error.message.includes("ORA-")) {
      response.status(400).json({ message: "Erro ao tentar logar. Verifique os dados e tente novamente." });
    } else {
      // Retorna a mensagem original para erros tratados
      response.status(400).json({ message: error.message });
    }
    
  }
});

export default router;
