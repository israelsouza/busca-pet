import express from "express";
import verificarUsuarioDB from "../model/verificarUsuarioDB.js";

const router = express.Router();

router.post("/", async (request, response) => {
  const dados = request.body;
  try {

    await verificarUsuarioDB(dados);

    response
    .status(200)
    .json({ message: "Login realizado com sucesso" });

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
