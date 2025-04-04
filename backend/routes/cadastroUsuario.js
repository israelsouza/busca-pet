import express from "express";
import inserirUsuarioBD from "../model/inserirUsuario.js";

const router = express.Router();

router.post("/", (request, response) => {
  const dados = request.body;
  response
    .status(200)
    .json({ message: "Mensagem vinda do Backend: Dados enviados com sucesso" });

  inserirUsuarioBD(dados);
});

export default router;
