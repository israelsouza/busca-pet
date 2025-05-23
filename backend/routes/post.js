import express from "express";
import {
  getPostPerdido,
  todosPosts,
  getPostEncontrado,
  getQuemPublicou,
} from "../controllers/PostControler.js";

const router = express.Router();

router.get("/all", todosPosts); // Rotas para todos os posts
router.get("/lost", getPostPerdido); // Rotas para pets perdidos
router.get("/found", getPostEncontrado); // Rotas para pets encontrados
router.post('/quem-publicou',getQuemPublicou )

export default router;
