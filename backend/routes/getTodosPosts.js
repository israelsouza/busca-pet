import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  // Exemplo: Acessar os dados do usuário autenticado
  const user = req.user;
  console.log("Usuário autenticado:", user);

  res.status(200).json({ message: "Acesso autorizado!" });
});

export default router;
