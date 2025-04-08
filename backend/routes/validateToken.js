import express from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/authConfig.js";

const router = express.Router();

router.get("/", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, SECRET_KEY); // verificar o token
    return res.status(200).json({ message: "Token válido" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expirado" });
    }
    return res.status(403).json({ message: "Token inválido" });
  }
});

export default router;
