import express from "express";
import bcrypt from 'bcrypt'
import inserirUsuarioBD from "../model/inserirUsuario.js";


const router = express.Router();



router.post("/", async (request, response) => {
  const dados = request.body;
  try {

    const saltRounds = 10; // Número de rounds para gerar o salt
    const salt = await bcrypt.genSalt(saltRounds);
    const senhaHash = await bcrypt.hash(dados.senha, salt);

    console.log("senha Hash FORA model: ", senhaHash)

    await inserirUsuarioBD(dados, senhaHash);

    response
    .status(200)
    .json({ message: "Cadastro realizado com sucesso" });

  } catch (error) {
    // console.error("Erro ao cadastrar usuário:", error);

    if (error.message.includes("ORA-")) {
      response.status(400).json({ message: "Erro ao realizar o cadastro. Verifique os dados e tente novamente." });
    } else {
      // Retorna a mensagem original para erros tratados
      response.status(400).json({ message: error.message });
    }
    
  }
});

export default router;
