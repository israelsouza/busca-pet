import express from "express";
import inserirUsuarioBD from "../model/inserirUsuario.js";

const router = express.Router();

router.post("/", async (request, response) => {
  const dados = request.body;
  try {

    await inserirUsuarioBD(dados);

    response
    .status(200)
    .json({ message: "Cadastro realizado com sucesso" });

  } catch (error) {
    // console.error("Erro ao cadastrar usuário:", error);
    response.status(400).json({ message: error.message });
  }
});

export default router;
